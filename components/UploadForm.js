// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Modal, Upload, message, Input, Progress, Button, Text } from 'antd';
// import { IconFileUpload, IconX, IconFile, IconCamera, IconMovie, IconCircleCheck } from '@tabler/icons-react';

// const { TextArea } = Input;

// export default function UploadForm({ item, onUpload, visible, onClose }) {
//   const [fileList, setFileList] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);
//   const textInputRef = useRef(null);

//   useEffect(() => {
//     if (!visible) {
//       setFileList([]);
//       setUploadProgress(0);
//       setUploading(false);
//       if (textInputRef.current) {
//         textInputRef.current.value = '';
//       }
//     }
//   }, [visible]);

//   const handleUpload = () => {
//     const formData = new FormData();
//     fileList.forEach((file) => {
//       formData.append('files[]', file);
//     });

//     setUploading(true);

//     // Simulate upload with progress
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       setUploadProgress(progress);
//       if (progress >= 100) {
//         clearInterval(interval);
//         setUploading(false);
//         message.success('Upload successful.');
//         const uploadedContent = {
//           type: fileList[0]?.type.startsWith('image/') ? 'image' : 'video',
//           url: URL.createObjectURL(fileList[0]),
//           file: fileList[0],
//         };
//         onUpload(item.id, uploadedContent);
//         onClose();
//         setFileList([]);
//       }
//     }, 200);
//   };

//   const handleTextChange = (e) => {
//     const text = e.target.value;
//     const content = { type: 'text', text };
//     onUpload(item.id, content);
//   };

//   const getFormatIcon = (format) => {
//     switch (format) {
//       case 'Image':
//       case 'Image Carousel':
//         return <IconCamera size="1.2rem" />;
//       case 'Video':
//       case 'Video/Reels':
//         return <IconMovie size="1.2rem" />;
//       default:
//         return <IconFile size="1.2rem" />;
//     }
//   };

//   const uploadProps = {
//     onRemove: (file) => {
//       const index = fileList.indexOf(file);
//       const newFileList = fileList.slice();
//       newFileList.splice(index, 1);
//       setFileList(newFileList);
//     },
//     beforeUpload: (file) => {
//       setFileList([...fileList, file]);
//       return false; // Prevent default upload behavior
//     },
//     fileList,
//   };

//   return (
//     <Modal
//       title={item ? `Upload ${item.format} for ${item.day}` : 'Upload Content'}
//       open={visible}
//       onOk={handleUpload}
//       confirmLoading={uploading}
//       onCancel={onClose}
//       okText="Upload"
//       cancelText="Cancel"
//       width={600}
//     >
//       <div style={{ marginBottom: '16px' }}>
//         {/* Check if item exists before accessing item.format */}
//         {item && ['Image', 'Video', 'Image Carousel', 'Video/Reels'].includes(item.format) && (
//           <Upload {...uploadProps}>
//             <Button icon={uploading ? <IconX size="1rem" /> : <IconFileUpload size="1.2rem" />}>
//               {/* Check if item exists before accessing item.format */}
//               {getFormatIcon(item.format)} Upload {item.format}
//             </Button>
//           </Upload>
//         )}
//         {/* Check if item exists before accessing item.format */}
//         {item && ['Text', 'Text/Image', 'Article', 'Poll'].includes(item.format) && (
//           <TextArea
//             rows={4}
//             placeholder="Enter text content"
//             ref={textInputRef}
//             onChange={handleTextChange}
//             style={{ width: '100%' }}
//           />
//         )}
//         {uploading && (
//           <div style={{ marginTop: '16px' }}>
//             <Progress percent={uploadProgress} size="small" status="active" />
//             <Text size="xs" type="secondary" style={{ marginTop: '8px', textAlign: 'center' }}>
//               {uploadProgress === 100 ? <IconCircleCheck size="0.8rem" /> : `Uploading... ${uploadProgress}%`}
//             </Text>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// }


'use client';

import { useState, useRef, useEffect } from 'react';
import { Modal, Upload, message, Input, Progress, Button, Typography } from 'antd'; // Import Typography
import { IconFileUpload, IconX, IconFile, IconCamera, IconMovie, IconCircleCheck } from '@tabler/icons-react';

const { TextArea } = Input;
const { Text } = Typography; 

export default function UploadForm({ item, onUpload, visible, onClose }) {
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      setFileList([]);
      setUploadProgress(0);
      setUploading(false);
      if (textInputRef.current) {
        textInputRef.current.value = '';
      }
    }
  }, [visible]);

  const handleUpload = async () => {
    if (fileList.length === 0 && (!textInputRef.current || !textInputRef.current.value)) {
      message.error('Please select a file or enter text content.');
      return;
    }
  
    if (fileList.length > 0) {
      // File upload logic
      const file = fileList[0];
      setUploading(true);
      setUploadProgress(0);
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
  
        try {
          const response = await fetch('/.netlify/functions/upload', {
            method: 'POST',
            body: JSON.stringify({
              file: {
                type: file.type,
                base64: base64Data,
              },
              metadata: {
                originalName: file.name,
              },
            }),
          });
  
          if (response.ok) {
            const data = await response.json();
            message.success('Upload successful.');
            onUpload(item.id, {
              type: file.type.startsWith('image/') ? 'image' : 'video',
              url: data.url,
              file: file,
            });
            setFileList([]);
          } else {
            message.error('Upload failed.');
          }
        } catch (error) {
          console.error('Upload error:', error);
          message.error('Upload failed.');
        } finally {
          setUploading(false);
          setUploadProgress(0);
        }
      };
  
      reader.onerror = () => {
        console.error('Error reading file.');
        message.error('Upload failed.');
        setUploading(false);
        setUploadProgress(0);
      };
    } else if (textInputRef.current && textInputRef.current.value) {
      // Text upload logic
      const text = textInputRef.current.value;
      const content = { type: 'text', text };
      onUpload(item.id, content);
      message.success('Text content saved.');
    }
  
    onClose();
  };
  

  const handleTextChange = (e) => {
    const text = e.target.value;
    const content = { type: 'text', text };
    onUpload(item.id, content);
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'Image':
      case 'Image Carousel':
        return <IconCamera size="1.2rem" />;
      case 'Video':
      case 'Video/Reels':
        return <IconMovie size="1.2rem" />;
      default:
        return <IconFile size="1.2rem" />;
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent default upload behavior
    },
    fileList,
  };

  return (
    <Modal
      title={item ? `Upload ${item.format} for ${item.day}` : 'Upload Content'}
      open={visible}
      onOk={handleUpload}
      confirmLoading={uploading}
      onCancel={onClose}
      okText="Upload"
      cancelText="Cancel"
      width={600}
    >
      <div style={{ marginBottom: '16px' }}>
        {item && ['Image', 'Video', 'Image Carousel', 'Video/Reels'].includes(item.format) && (
          <Upload {...uploadProps}>
            <Button icon={uploading ? <IconX size="1rem" /> : <IconFileUpload size="1.2rem" />}>
              {getFormatIcon(item.format)} Upload {item.format}
            </Button>
          </Upload>
        )}
        {item && ['Text', 'Text/Image', 'Article', 'Poll'].includes(item.format) && (
          <TextArea
            rows={4}
            placeholder="Enter text content"
            ref={textInputRef}
            onChange={handleTextChange}
            style={{ width: '100%' }}
          />
        )}
        {uploading && (
          <div style={{ marginTop: '16px' }}>
            <Progress percent={uploadProgress} size="small" status="active" />
            <Text size="xs" type="secondary" style={{ marginTop: '8px', textAlign: 'center' }}>
              {uploadProgress === 100 ? <IconCircleCheck size="0.8rem" /> : `Uploading... ${uploadProgress}%`}
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
}