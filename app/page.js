'use client';

import { useState } from 'react';
import { Layout, Menu,  theme, } from 'antd';
import {
    CalendarOutlined,
    FileTextOutlined,
    PictureOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    EyeOutlined,
    UserOutlined,
    FileOutlined,
    TeamOutlined,
    FundOutlined,
    FileDoneOutlined,
    CalendarFilled,
    GithubOutlined,
} from '@ant-design/icons';
import CalendarTable from '../components/CalendarTable';
import FilterSidebar from '../components/FilterSidebar';
import { data } from '../lib/data';

const { Header, Content, Footer, Sider } = Layout;

export default function Home() {
    const [collapsed, setCollapsed] = useState(false);
   

    

   

    const [filters, setFilters] = useState({
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        platforms: ['all', 'instagram', 'twitter', 'facebook', 'linkedin'],
    });

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const [calendarData, setCalendarData] = useState(data);

    const handleContentUpload = (itemId, content) => {
        setCalendarData((prevData) =>
            prevData.map((item) =>
                item.id === itemId ? { ...item, uploadedContent: content } : item
            )
        );
    };

    const filteredData = calendarData.filter((item) => {
        const dayMatch = filters.days.includes(item.day.toLowerCase());
        const platformMatch =
            filters.platforms.includes('all') ||
            filters.platforms.includes(item.platform.toLowerCase());
        return dayMatch && platformMatch;
    });

    const groupedData = {};
    filteredData.forEach((item) => {
        if (!groupedData[item.week]) {
            groupedData[item.week] = [];
        }
        groupedData[item.week].push(item);
    });

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            {collapsed ? (
          <div style={{ margin: '16px ', display: 'flex', justifyContent: 'center' }}>
            <img src="/vercel.svg" alt="Vercel Logo" style={{ height: 40, transform: 'scale(1.2)' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', margin: '16px' }}>
            <img src="/logo.png" alt="OctaVertex Media Logo" style={{ height: 40, marginRight: '16px' }} />
          
          </div>
        )}
                <FilterSidebar filters={filters} onFilterChange={handleFilterChange}  />
            </Sider>
            <Layout>
            <Header style={{ padding: '0 16px', background: '#001529', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 72}}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {/* Your logo and company name go here */}
  </div>
  <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '600', margin: 0 }}>
    January 2025 Social Media Content Calendar
  </h2>
</Header>

                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                       
                        {Object.keys(groupedData).map((week) => (
                            <CalendarTable key={week} week={week} data={groupedData[week]} onUpload={handleContentUpload} />
                        ))}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center', backgroundColor: colorBgContainer }}>
                    <a href="https://octavertexmedia.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                        OctaVertex Media
                    </a>
                </Footer>
            </Layout>
        </Layout>
    );
}