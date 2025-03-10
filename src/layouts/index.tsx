import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, Layout, Menu, theme, Typography  } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../assets/Gsynergy Logo.svg";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { items } from "./siderItems";
import { setChartData } from "../redux-store/slices/chartSlice";
import { setStoreData } from "../redux-store/slices/storeSlice";
import { setSkuData } from "../redux-store/slices/skuSlice";
import { readExcelFile } from "../utils";
import styles from "./layouts.module.css";


const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [xlData, setXlData] = useState<Record<string, any[]> | null>(null);
  const selectedKey = items.find(
    (item) => item.path === location.pathname
  )?.key;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  console.log(xlData);
  const fetchExcelData = async () => {
    try {
      const jsonData = await readExcelFile("/SampleData.xlsx");
      if (jsonData) {
        setXlData(jsonData);
        dispatch(setStoreData(jsonData.Stores));
        dispatch(setSkuData(jsonData.SKUs));
        dispatch(setChartData(jsonData.Chart));
      }
    } catch (error) {
      console.error("Error reading Excel file:", error);
    }
  };

  useEffect(() => {
    fetchExcelData();
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="signout" icon={<LogoutOutlined />}>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className={styles.container}>
      <Sider
        style={{ background: colorBgContainer }}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className={styles.demoLogoVertical}>
          <img src={Logo} alt="logo" />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey || "1"]}
          onClick={(e) => {
            const selectedItem = items.find((item) => item.key === e.key);
            if (selectedItem?.path) {
              navigate(selectedItem.path);
            }
          }}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#f0f2f5",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <div style={{ flex: 1 }}></div>
          <Title
            level={3}
            style={{
              flex: 1,
              textAlign: "center",
              margin: 0,
              fontWeight: "bold",
            }}
          >
            DATA VIEWER APP
          </Title>
          <div style={{ flex: 1, textAlign: "right" }}>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: "10px 10px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
