import { ConfigProvider } from 'antd';
// Import antd CSS file
import 'antd/dist/reset.css'; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}