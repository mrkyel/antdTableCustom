import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  UserOutlined,
  // LaptopOutlined,
  // NotificationOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import './home.scss';
import { Link } from 'react-router-dom';
import HeaderComponent from '../../components/header/HeaderComponent';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const Home = ({ children }) => {
  return (
    <Layout>
      <HeaderComponent />
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1', 'sub2', 'sub3']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
              <Menu.Item key="1">
                <Link to="/option1">option1</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/option2">option2</Link>
              </Menu.Item>
              {/* <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item> */}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
