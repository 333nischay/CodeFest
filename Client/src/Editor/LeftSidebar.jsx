
import React, { useState } from 'react';
import { FolderTree, FileText, Settings, Plus, FileIcon, Sun,Moon, Trash } from 'lucide-react';
import FontSize from "../components/FontSize";
const LeftSidebar = ({ Data ,addFile,fontSize, onFontSizeChange, theme, onThemeToggle, onThemeSelect}) => {
  const [data, setData] = useState(Data);
  const [newFolderName, setNewFolderName] = useState('');
  const [showInput, setShowInput] = useState(null);
  const [showFileInput, setShowFileInput] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themes = ['vs-dark', 'vs-light', 'monokai', 'night-owl', 'chrome-devtools', 'active4d'];

  const handleThemeToggle = () => {
    onThemeToggle();
  };
  const handleThemeSelect = (selectedTheme) => {
    onThemeSelect(selectedTheme);
    setIsThemeDropdownOpen(false);
  };


  const handleAddFolder = (parentId) => {
    setShowInput(parentId);
  };
  const handleAddFile = (parentId) => {
    setShowFileInput(parentId);
  };
  const handleCreateFile = async(e, parentId) => { 
    e.preventDefault();
    const data1 = {name: newFileName, parentId, workspaceId:data.workspaceId,content:''};
    
    
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/file/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(data1),
        });
        const res = await response.json();
        const file = res.data.file;
        const updateData = (node) => {
          if (node._id === parentId) {
            return { ...node, files: [...node.files, file] };
          }
          return {
            ...node,
            children: node.children.map(updateData),
          };
        };
        setData(updateData(data));
        setNewFileName('');
        setShowFileInput(null);
        const newFile = {
          id:file._id,
          name: file.name,
          content: file.content,
        }
        addFile(newFile);
      } catch (error) {
        
      }


  }

  const handleCreateFolder = async(e, parentId) => {
    e.preventDefault();
    const data1 = {name: newFolderName, parentId, workspaceId:data.workspaceId};
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/folder/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data1),
      });
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        } else {
          throw new Error('Unexpected response format');
        }
      }
      const res = await response.json();
      const folder = res.data.folder;
      const updateData = (node) => {
        if (node._id === parentId) {
          return { ...node, children: [...node.children, folder] };
        }
        return {
          ...node,
          children: node.children.map(updateData),
        };
      };

      setData(updateData(data));
      setNewFolderName('');
      setShowInput(null);

      
    } catch (error) {
      
    }
  };
  const handleDeleteFolder = async (folderId,parentId) => { 
    if(folderId === data._id){
      console.log("Not Allowed");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/folder/delete/${folderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        } else {
          throw new Error('Unexpected response format');
        }
      }
      const updateData = (node) => {
        if (node._id === parentId) {
          return { ...node, children: node.children.filter(child => child._id !== folderId) };
        }
        return {
          ...node,
          children: node.children.map(updateData),
        };
      };

      setData(updateData(data));
      console.log(data);

      
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeleteFile = async (fileId,parentId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/file/delete/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        } else {
          throw new Error('Unexpected response format');
        }
      }
      const updateData = (node) => {
        if (node._id === parentId) {
          return { ...node, files: node.files.filter(file => file._id !== fileId) };
        }
        return {
          ...node,
          children: node.children.map(updateData),
        };
      };

      setData(updateData(data));

      
    } catch (error) {
      console.log(error);
    }
  }
  const handleAddTabFile = (file) => {
   const newFile = {
    id: file._id,
    name: file.name,
    content: file.content,
   }
   addFile(newFile);  
  } 

  const renderTree = (node) => {
    return (
      <div key={node._id} className="ml-1">
        <div className="flex items-center p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-gray-100 justify-between">
          <div className='flex items-center gap-2'>
          <FolderTree size={16} />
          <span>{node.name}</span>
          </div>
          <div>
          <button onClick={()=> handleAddFile(node._id)} className="ml-auto p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200">
            <FileIcon size={16} />
          </button>
          <button onClick={() => handleAddFolder(node._id)} className="ml-auto p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200">
            <Plus size={16} />
          </button>
          <button onClick={()=>{handleDeleteFolder(node._id,node.parentId)}} className="ml-auto p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200">
            <Trash size={16} />
          </button>
          </div>
        </div>
        {showInput === node._id && (
          <div className="ml-1 flex items-center gap-2 p-2">
            <form onSubmit={(e) => handleCreateFolder(e, node._id)}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder(e, node._id);
                  }
                }}
                className="bg-gray-800 text-gray-300 p-1 rounded outline-none"
                placeholder="New folder name"
              />
            </form>
          </div>
        )}
        {
          showFileInput === node._id && (
            <div className="ml-1 flex items-center gap-2 p-2">
              <form onSubmit={(e) => handleCreateFile(e, node._id)}>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFile(e, node._id);
                    }
                  }}
                  className="bg-gray-800 text-gray-300 p-1 rounded outline-none"
                  placeholder="New file name"
                />
              </form>
            </div>
          )
        }
        <div className="ml-1">
          {node.children.map((child) => renderTree(child))}
          {node.files.map((file) => (
            <div key={file._id} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-gray-100" onClick={()=>{handleAddTabFile(file)}}>
              <FileText size={16} />
              <span>{file.name}</span>
              <button onClick={()=>{handleDeleteFile(file._id,file.parentId)}} className="ml-auto p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200">
            <Trash size={16} />
          </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* File Explorer Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h2 className="font-semibold text-gray-200">File Explorer</h2>
        <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200">
          <Settings size={16} />
        </button>
      </div>
  
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {data ? renderTree(data) : <div>Loading...</div>}
      </div>
  
      {/* Settings Section */}
      <div className="border-t border-gray-700 p-3 flex flex-col gap-1 justify-center items-center">
        <button
          onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
          className="w-full px-3 py-1 rounded-lg bg-gray-700 text-white shadow-md hover:bg-gray-600 transition-transform transform hover:scale-105 flex items-center gap-2"
        >
          <p className="text-white-200 mx-auto">Editor Settings</p>
        </button>
        
        {!isSettingsCollapsed && (
          <div className="space-y-4 mx-auto">
            <FontSize fontSize={fontSize} onFontSizeChange={onFontSizeChange} />
            <button
              onClick={handleThemeToggle}
              className="w-full px-3 py-1 mx-auto rounded-lg bg-gray-700 text-white shadow-md hover:bg-gray-600 transition-transform transform hover:scale-105 flex items-center gap-2"
            >
              <p className="text-white-200 mx-auto">
                {theme === "vs-dark" ? <Moon size={16} /> : <Sun size={16} />}
              </p>
            </button>
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="w-full px-3 py-1 mx-auto rounded-lg bg-gray-700 text-white shadow-md hover:bg-gray-600 transition-transform transform hover:scale-105 flex items-center gap-2"
            >
              <p className="text-white-200 mx-auto">Select Theme</p>
            </button>
            {isThemeDropdownOpen && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-2 mt-2">
                {themes.map((themeName) => (
                  <div
                    key={themeName}
                    onClick={() => handleThemeSelect(themeName)}
                    className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-gray-100 cursor-pointer"
                  >
                    {themeName}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
