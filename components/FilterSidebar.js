'use client';

import { useState, useEffect } from 'react';
import { Menu, Switch, theme } from 'antd';
import {
    IconCalendarTime,
    IconCheck,
    IconBrandInstagram,
    IconBrandTwitter,
    IconBrandFacebook,
    IconBrandLinkedin,
    IconUsers,
} from '@tabler/icons-react';

const { SubMenu } = Menu;

export default function FilterSidebar({ filters, onFilterChange }) {
  const { token } = theme.useToken();
  const [mode, setMode] = useState('inline');

  const handleCheckboxChange = (name, value, checked) => {
    const newFilters = { ...filters };
    if (name === 'day') {
      newFilters.days = checked
        ? [...newFilters.days, value]
        : newFilters.days.filter((day) => day !== value);
    } else if (name === 'platform') {
      newFilters.platforms = checked
        ? [...newFilters.platforms, value]
        : newFilters.platforms.filter((platform) => platform !== value);
    }
    onFilterChange(newFilters);
  };

  const dayOptions = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const platformOptions = ['all', 'instagram', 'twitter', 'facebook', 'linkedin'];

  const platformIcons = {
    all: <IconUsers size="1.1rem" />,
    instagram: <IconBrandInstagram size="1.1rem" />,
    twitter: <IconBrandTwitter size="1.1rem" />,
    facebook: <IconBrandFacebook size="1.1rem" />,
    linkedin: <IconBrandLinkedin size="1.1rem" />,
  };

  const getMenuItemStyles = (option, isDayFilter) => {
    const isSelected = isDayFilter
      ? filters.days.includes(option)
      : filters.platforms.includes(option);

    return {
      backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
      color: isSelected ? '#1890ff' : 'rgba(0, 0, 0, 0.65)',
    };
  };

  const menuItems = [
    {
      key: 'days',
      icon: <IconCalendarTime size="1.2rem" color="black" />,
      label: <span style={{ fontWeight: 600 }}>Filter by Day</span>,
      children: dayOptions.map((day) => ({
        key: day,
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={filters.days.includes(day)}
              onChange={(event) => handleCheckboxChange('day', day, event.target.checked)}
              style={{ display: 'none' }}
              id={`day-${day}`}
            />
            <label htmlFor={`day-${day}`} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              {filters.days.includes(day) && (
                <IconCheck size="0.8rem" stroke={2.5} style={{ marginRight: '8px' }} />
              )}
              <span style={{ marginLeft: filters.days.includes(day) ? 0 : '20px' }}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </span>
            </label>
          </div>
        ),
        style: getMenuItemStyles(day, true),
      })),
    },
    {
      key: 'platforms',
      icon: <IconUsers size="1.2rem" color="black" />,
      label: <span style={{ fontWeight: 600 }}>Filter by Platform</span>,
      children: platformOptions.map((platform) => ({
        key: platform,
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={filters.platforms.includes(platform)}
              onChange={(event) =>
                handleCheckboxChange('platform', platform, event.target.checked)
              }
              style={{ display: 'none' }}
              id={`platform-${platform}`}
            />
            <label htmlFor={`platform-${platform}`} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              {filters.platforms.includes(platform) && (
                <IconCheck size="0.8rem" stroke={2.5} style={{ marginRight: '8px' }} />
              )}
              <span style={{ marginLeft: filters.platforms.includes(platform) ? 0 : '20px' }}>
                {platformIcons[platform]}
                <span style={{ marginLeft: '8px' }}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </span>
            </label>
          </div>
        ),
        style: getMenuItemStyles(platform, false),
      })),
    },
  ];

  return (
    <Menu
      mode={mode}
      defaultOpenKeys={['days', 'platforms']}
      style={{ height: '100%', borderRight: 0, backgroundColor: token.colorBgContainer }}
      items={menuItems}
    />
  );
}