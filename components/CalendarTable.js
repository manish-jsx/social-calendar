import { useState } from 'react';
import { Table, Space, Tooltip, Avatar, Tag, Button } from 'antd';
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconCalendarEvent,
  IconPencil,
  IconBlockquote,
  IconLink,
  IconFile,
  IconPhoto,
  IconVideo,
  IconUpload,
  IconEye,
} from '@tabler/icons-react';
import UploadForm from './UploadForm';
import Preview from './Preview';

const platformColors = {
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
};

const formatIcons = {
  Image: <IconPhoto size="1.2rem" />,
  Video: <IconVideo size="1.2rem" />,
  'Image/Video': <><IconPhoto size="1.2rem" /> <IconVideo size="1.2rem" /></>,
  'Image Carousel': <IconPhoto size="1.2rem" />,
  'Text/Image': <><IconBlockquote size="1.2rem" /> <IconPhoto size="1.2rem" /></>,
  Article: <IconFile size="1.2rem" />,
  Poll: <IconFile size="1.2rem" />, // Consider a more suitable icon
  'Image/Link': <><IconPhoto size="1.2rem" /> <IconLink size="1.2rem" /></>,
};

export default function CalendarTable({ week, data, onUpload }) {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleUpload = (item) => {
    setSelectedItem(item);
    setUploadModalVisible(true);
  };

  const handlePreview = (item) => {
    setSelectedItem(item);
    setPreviewModalVisible(true);
  };

  const handleUploadModalClose = () => {
    setUploadModalVisible(false);
    setSelectedItem(null);
  };

  const handlePreviewModalClose = () => {
    setPreviewModalVisible(false);
    setSelectedItem(null);
  };

  const getPlatformIcon = (platform, isDarkMode) => {
    const color = isDarkMode ? 'white' : 'black';
    switch (platform) {
      case 'instagram':
        return <IconBrandInstagram size="1.2rem" color={platformColors[platform]} />;
      case 'twitter':
        return <IconBrandTwitter size="1.2rem" color={platformColors[platform]} />;
      case 'facebook':
        return <IconBrandFacebook size="1.2rem" color={platformColors[platform]} />;
      case 'linkedin':
        return <IconBrandLinkedin size="1.2rem" color={platformColors[platform]} />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => (
        <Tooltip title={<span style={{ fontSize: '12px' }}>{text}</span>}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconCalendarEvent size="1.2rem" color='black' />
            <span style={{ fontSize: '12px' }}>{text}</span>
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
      render: (text) => <span style={{ fontSize: '12px' }}>{text}</span>,
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      render: (text) => (
        <Space>
          {getPlatformIcon(text.toLowerCase())}
          <span style={{ fontSize: '12px' }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Theme',
      dataIndex: 'theme',
      key: 'theme',
      render: (text) => <span style={{ fontSize: '12px' }}>{text}</span>,
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: (text) => (
        <Space>
          {formatIcons[text]}
          <span style={{ fontSize: '12px' }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span style={{ fontSize: '12px' }}>{text}</span>,
    },
    {
      title: 'Call to Action',
      dataIndex: 'cta',
      key: 'cta',
      render: (text) => <span style={{ fontSize: '12px' }}>{text}</span>,
    },
    {
      title: 'Hashtags',
      dataIndex: 'hashtags',
      key: 'hashtags',
      render: (hashtags) => (
        <span style={{ fontSize: '12px' }}>
          {hashtags.map((tag) => (
            <Tag key={tag} color="blue" style={{ marginBottom: '4px' }}>
              {tag}
            </Tag>
          ))}
        </span>
      ),
    },
    {
        title: 'Upload',
        key: 'upload',
        render: (text, record) => (
          <Tooltip title="Upload Content">
            <Button
              icon={<IconUpload size="1.2rem" />}
              onClick={() => handleUpload(record)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
        ),
      },
      {
        title: 'Preview',
        key: 'preview',
        render: (text, record) => (
          <Tooltip title="Preview">
            <Button
              icon={<IconEye size="1.2rem" />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
        ),
      },
    ];

    return (
        <div>
          <h2>{week}</h2>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            size="small" // Added for smaller row height
            pagination={false} // Disable pagination if not needed
          />
    
          <UploadForm
            visible={uploadModalVisible}
            onClose={handleUploadModalClose}
            item={selectedItem}
            onUpload={onUpload}
          />
    
          <Preview
            visible={previewModalVisible}
            onClose={handlePreviewModalClose}
            item={selectedItem}
          />
        </div>
      );
    }