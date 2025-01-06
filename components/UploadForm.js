'use client';

import { useState, useRef, useEffect } from 'react';
import { Modal, Upload, message, Input, Progress, Button, Typography } from 'antd';
import { IconFileUpload, IconX, IconFile, IconCamera, IconMovie, IconCircleCheck } from '@tabler/icons-react';

const { TextArea } = Input;
const { Text } = Typography;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

export default function UploadForm({ item, onUpload, visible, onClose }) {
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const uploadControllerRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
    return () => {
      if (uploadControllerRef.current) {
        uploadControllerRef.current.abort();
      }
    };
  }, [visible]);

  const resetForm = () => {
    setFileList([]);
    setUploadProgress(0);
    setUploading(false);
    setError(null);
    if (textInputRef.current) {
      textInputRef.current.value = '';
    }
  };

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File must be smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    const allowedTypes = item.format.toLowerCase().includes('image') 
      ? ALLOWED_IMAGE_TYPES 
      : ALLOWED_VIDEO_TYPES;

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported. Please upload ${item.format.toLowerCase()}`);
    }

    return true;
  };

  const handleUpload = async () => {
    if (fileList.length === 0 && (!textInputRef.current || !textInputRef.current.value)) {
      message.error('Please select a file or enter text content.');
      return;
    }

    if (fileList.length > 0) {
      const file = fileList[0];
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        validateFile(file);

        uploadControllerRef.current = new AbortController();

        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: uploadControllerRef.current.signal,
          body: JSON.stringify({
            file: {
              type: file.type,
              base64: base64Data,
            },
            metadata: {
              originalName: file.name,
              itemId: item.id,
              contentType: file.type,
              size: file.size,
              uploadedAt: new Date().toISOString(),
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed.');
        }

        const data = await response.json();
        setUploadProgress(100);

        message.success('Upload successful!');
        onUpload(item.id, {
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: data.url,
          metadata: {
            id: data.id, 
            type: file.type,
            name: file.name,
            size: file.size,
          },
        });

        resetForm();
        onClose();
      } catch (error) {
        if (error.name === 'AbortError') {
          message.info('Upload cancelled');
        } else {
          console.error('Upload error:', error);
          setError(error.message);
          message.error(error.message || 'Upload failed. Please try again.');
        }
        setUploadProgress(0);
      } finally {
        setUploading(false);
        uploadControllerRef.current = null;
      }
    } else if (textInputRef.current?.value) {
      const text = textInputRef.current.value;
      onUpload(item.id, { type: 'text', text });
      message.success('Text content saved.');
      resetForm();
      onClose();
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    onUpload(item.id, { type: 'text', text });
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
    onRemove: () => {
      setFileList([]);
      setError(null);
    },
    beforeUpload: (file) => {
      try {
        validateFile(file);
        setFileList([file]);
        setError(null);
      } catch (err) {
        message.error(err.message);
      }
      return false;
    },
    fileList,
    accept: item?.format?.toLowerCase().includes('image') 
      ? ALLOWED_IMAGE_TYPES.join(',')
      : ALLOWED_VIDEO_TYPES.join(','),
  };

  return (
    <Modal
      title={item ? `Upload ${item.format} for ${item.day}` : 'Upload Content'}
      open={visible}
      onOk={handleUpload}
      confirmLoading={uploading}
      onCancel={() => {
        if (uploading && uploadControllerRef.current) {
          uploadControllerRef.current.abort();
        }
        onClose();
      }}
      okText="Upload"
      cancelText="Cancel"
      width={600}
    >
      <div style={{ marginBottom: '16px' }}>
        {error && (
          <div style={{ marginBottom: '16px', color: '#ff4d4f' }}>
            {error}
          </div>
        )}
        
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
            <Progress percent={uploadProgress} size="small" status={error ? 'exception' : 'active'} />
            <Text size="xs" type="secondary" style={{ marginTop: '8px', textAlign: 'center' }}>
              {uploadProgress === 100 ? (
                <span>
                  <IconCircleCheck size="0.8rem" style={{ marginRight: '4px' }} />
                  Upload complete!
                </span>
              ) : (
                `Uploading... ${uploadProgress}%`
              )}
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
}