import { User } from "../models/user.model.js";
import { WorkSpace } from "../models/workspace.model.js";
import { Folder } from "../models/folder.model.js"; 
import { File } from "../models/file.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import {v4 as uuidv4} from "uuid";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendMail } from "../utils/sendMail.js";

const createWorkSpace = asynchandler(async (req, res) => {
    const { name, type, contributors } = req.body;
    const user = await User.findById(req.user._id);
    if(!user || !user.isVerified){
        throw new ApiError(400,"User not found")
    }
    const existed = user.workSpace.find((ws)=>ws.name === name);
    if(existed){
        throw new ApiError(400,"Workspace already exists")
    }
    const workspace = await WorkSpace.create({name,userId:req.user._id,type});
    if(!workspace){
        throw new ApiError(500,"Failed to create workspace")
    }
    user.workSpace.push(workspace._id);
    const rootFolder = await Folder.create({name:"root",userId:user._id, workspaceId:workspace._id});
    workspace.rootFolder = rootFolder._id;
    await user.save();
    if (contributors) {
        const emailPromises = contributors.map(async (email) => {
            const token = uuidv4();
            workspace.invitations.push({ email, token });
            const invitationLink = `${process.env.CORS_ORIGIN}/workspaceInvite?token=${token}&workspaceId=${workspace._id}`;
            const mailHtml = `You have been invited to workspace ${name}. Click <a href="${invitationLink}">here</a> to join`;
            return sendMail(email, "Workspace Invitation", mailHtml);
        });

        try {
            await Promise.all(emailPromises);
            await workspace.save();     
        } catch (error) {
            throw new ApiError(500, error.message);
        }
    }
return res.json(new ApiResponse(200,{message:"Workspace created successfully",workspaceId:workspace._id}));

}
);
const addInvitation = asynchandler(async (req, res) => {
    const { token, workspaceId } = req.body;
    console.log(token, workspaceId);
    const workspace = await WorkSpace.findById(workspaceId);
    if (!workspace) {
        throw new ApiError(400, "Workspace not found");
    }
    const invitation = workspace.invitations.find((inv) => inv.token === token);
    if (!invitation) {
        throw new ApiError(400, "Invalid invitation token");
    }
    if(invitation.email !== req.user.email){
        throw new ApiError(400,"Invalid user")
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(400, "User not found");
    }
    user.workSpace.push(workspaceId);
    workspace.contributors.push(req.user._id);
    workspace.invitations = workspace.invitations.filter((inv) => inv.token !== token);
    await workspace.save();
    await user.save();
    return res.json(new ApiResponse(200, { message: "Invitation accepted successfully"}));
});
const sendInvitation = asynchandler(async (req, res) => {
    const { email, workspaceId } = req.body;
    const workspace = await WorkSpace.findById(workspaceId);
    if (!workspace) {
        throw new ApiError(400, "Workspace not found");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(400, "User not found");
    }
    const token = uuidv4();
    workspace.invitations.push({ email, token });
    const invitationLink = `${process.env.CORS_ORIGIN}/workspaceInvite?token=${token}&workspaceId=${workspaceId}`;
    const mailHtml = `You have been invited to workspace ${workspace.name}. Click <a href="${invitationLink}">here</a> to join`;
    try {
        await sendMail(email, "Workspace Invitation", mailHtml);
        await workspace.save();
    } catch (error) {
        throw new ApiError(500, error.message);
    }
    return res.json(new ApiResponse(200, { message: "Invitation sent successfully" }));
});

const getWorkSpace = asynchandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const workspace = await WorkSpace.findById(id);
    if (!workspace) {
        throw new ApiError(400, "Workspace not found");
    }
    if (workspace.type === "private" && !workspace.contributors.includes(req.user._id) && workspace.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "User not allowed");
    }
    console.log(workspace.rootFolder);
    let rootFolder = await Folder.findById(workspace.rootFolder);
    const fetchFolder = async(folder)=>{
        folder = await Folder.findById(folder._id).populate('children').populate('files');
        for (let i = 0; i < folder.children.length; i++) {
            folder.children[i] = await fetchFolder(folder.children[i]);
        }
        for(let i=0;i<folder.files.length;i++){
            folder.files[i] = await File.findById(folder.files[i]);
        }
        return folder;
    }
    rootFolder = await fetchFolder(rootFolder);
    return res.json(new ApiResponse(200, { data: rootFolder }));
});


export { createWorkSpace, addInvitation, sendInvitation, getWorkSpace };