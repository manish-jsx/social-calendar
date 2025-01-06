// import { useState, useEffect } from 'react';
// import { Modal, Image, Typography, Space } from 'antd';
// import {
//     IconMessageCircle,
//     IconHeart,
//     IconShare,
//     IconBrandTwitter,
//     IconRepeat,
//     IconBrandInstagram,
//     IconBrandFacebook,
//     IconBrandLinkedin,
// } from '@tabler/icons-react';

// const { Text } = Typography;

// export default function Preview({ item, visible, onClose }) {
//     const [previewContent, setPreviewContent] = useState(null);

//     useEffect(() => {
//         if (item && item.uploadedContent) {
//             const content = item.uploadedContent;
//             if (content.type === 'image') {
//                 setPreviewContent(
//                     <Image src={content.url} alt="Preview" width="100%" height="auto" style={{ borderRadius: '8px' }} />
//                 );
//             } else if (content.type === 'video') {
//                 setPreviewContent(
//                     <video controls width="100%" height="auto" style={{ borderRadius: '8px' }}>
//                         <source src={content.url} type="video/mp4" />
//                         Your browser does not support the video tag.
//                     </video>
//                 );
//             } else if (content.type === 'text') {
//                 setPreviewContent(<Text style={{ fontSize: '14px' }}>{content.text}</Text>);
//             }
//         } else {
//             setPreviewContent(<Text style={{ fontSize: '14px' }}>Upload content to see preview</Text>);
//         }
//     }, [item]);

//     const getIcon = (platform, iconType) => {
//         const iconProps = { style: { marginRight: 8 } };
//         switch (platform) {
//             case 'twitter':
//                 switch (iconType) {
//                     case 'heart':
//                         return <IconHeart size="1.2rem" {...iconProps} />;
//                     case 'repeat':
//                         return <IconRepeat size="1.2rem" {...iconProps} />;
//                     case 'message':
//                         return <IconMessageCircle size="1.2rem" {...iconProps} />;
//                     default:
//                         return null;
//                 }
//             case 'instagram':
//             case 'facebook':
//             case 'linkedin':
//                 switch (iconType) {
//                     case 'heart':
//                         return <IconHeart size="1.2rem" {...iconProps} />;
//                     case 'message':
//                         return <IconMessageCircle size="1.2rem" {...iconProps} />;
//                     case 'share':
//                         return <IconShare size="1.2rem" {...iconProps} />;
//                     default:
//                         return null;
//                 }
//             default:
//                 return null;
//         }
//     };

//     const platformStyles = {
//         instagram: {
//             username: 'octavertexmedia',
//         },
//         twitter: {
//             username: '@octavertexmedia',
//         },
//         facebook: {
//             username: 'OctaVertex Media',
//         },
//         linkedin: {
//             username: 'OctaVertex Media',
//         },
//         all: {
//             username: 'OctaVertex Media',
//         },
//     };

//     const platform = item && item.platform ? item.platform.toLowerCase() : 'all';
//     const { username } = platformStyles[platform] || platformStyles.all;

//     return (
//         <Modal
//             title={`Preview for ${item ? item.platform : ''}`}
//             open={visible}
//             onCancel={onClose}
//             footer={null}
//             width={400} // Adjusted width
//         >
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                 <div
//                     style={{
//                         width: '40px',
//                         height: '40px',
//                         borderRadius: '50%',
//                         backgroundColor: '#ddd',
//                         marginRight: '10px',
//                     }}
//                 />
//                 <Text strong>{username}</Text>
//             </div>
//             <div style={{ marginBottom: '16px' }}>{previewContent}</div>
//             <Space>
//                 {getIcon(platform, 'heart')}
//                 {platform !== 'twitter' && getIcon(platform, 'message')}
//                 {platform !== 'facebook' && platform !== 'linkedin' && getIcon(platform, 'share')}
//                 {platform === 'twitter' && getIcon(platform, 'repeat')}
//             </Space>
//         </Modal>
//     );
// }

import { useState, useEffect } from 'react';
import { Modal, Image, Typography, Space } from 'antd';
import {
    IconMessageCircle,
    IconHeart,
    IconShare,
    IconBrandTwitter,
    IconRepeat,
    IconBrandInstagram,
    IconBrandFacebook,
    IconBrandLinkedin,
} from '@tabler/icons-react';

const { Text } = Typography;

export default function Preview({ item, visible, onClose }) {
    const [previewContent, setPreviewContent] = useState(null);

    useEffect(() => {
        if (item && item.uploadedContent) {
            const content = item.uploadedContent;
            const url = content.url;

            if (content.type === 'image') {
                setPreviewContent(
                    <Image src={url} alt="Preview" width="100%" height="auto" style={{ borderRadius: '8px' }} />
                );
            } else if (content.type === 'video') {
                setPreviewContent(
                    <video controls width="100%" height="auto" style={{ borderRadius: '8px' }}>
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                );
            } else if (content.type === 'text') {
                setPreviewContent(<Text style={{ fontSize: '14px' }}>{content.text}</Text>);
            }
        } else {
            setPreviewContent(<Text style={{ fontSize: '14px' }}>Upload content to see preview</Text>);
        }
    }, [item]);

    const getIcon = (platform, iconType) => {
        const iconProps = { style: { marginRight: 8 } };
        switch (platform) {
            case 'twitter':
                switch (iconType) {
                    case 'heart':
                        return <IconHeart {...iconProps} />;
                    case 'repeat':
                        return <IconRepeat {...iconProps} />;
                    case 'message':
                        return <IconMessageCircle {...iconProps} />;
                    default:
                        return null;
                }
            case 'instagram':
            case 'facebook':
            case 'linkedin':
                switch (iconType) {
                    case 'heart':
                        return <IconHeart {...iconProps} />;
                    case 'message':
                        return <IconMessageCircle {...iconProps} />;
                    case 'share':
                        return <IconShare {...iconProps} />;
                    default:
                        return null;
                }
            default:
                return null;
        }
    };

    const platformStyles = {
        instagram: {
            username: 'octavertexmedia',
        },
        twitter: {
            username: '@octavertexmedia',
        },
        facebook: {
            username: 'OctaVertex Media',
        },
        linkedin: {
            username: 'OctaVertex Media',
        },
        all: {
            username: 'OctaVertex Media',
        },
    };

    const platform = item && item.platform ? item.platform.toLowerCase() : 'all';
    const { username } = platformStyles[platform] || platformStyles.all;

    return (
        <Modal
            title={`Preview for ${item ? item.platform : ''}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={400}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#ddd',
                        marginRight: '10px',
                    }}
                />
                <Text strong>{username}</Text>
            </div>
            <div style={{ marginBottom: '16px' }}>{previewContent}</div>
            <Space>
                {getIcon(platform, 'heart')}
                {platform !== 'twitter' && getIcon(platform, 'message')}
                {platform !== 'facebook' && platform !== 'linkedin' && getIcon(platform, 'share')}
                {platform === 'twitter' && getIcon(platform, 'repeat')}
            </Space>
        </Modal>
    );
}