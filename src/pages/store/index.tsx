import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { DeleteOutlined, HolderOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";;
import { addStore, deleteStore } from "../../redux-store/slices/storeSlice";
import styles from "./store.module.css";

type StoreData = {
    seqNo: number;
    id: string;
    label: string;
    city: string;
    state: string;
}

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Store = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const storeData = useSelector((state: any) => state.storeSlice.data);
    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);

    const [rowData, setRowData] = useState<any[]>([]);

    useEffect(() => {
        if (storeData?.length) {
            const formattedData = storeData.map((item: any) => ({
                id: item.id,
                sno: item.seqNo,
                store: item.label,
                city: item.city,
                state: item.state,
            }));
            setRowData(formattedData);
        }
    }, [storeData]);

    const handleDelete = (id: string) => {
        dispatch(deleteStore(id));
    };

    const [columnDefs] = useState<ColDef[]>([
        {
            headerName: "",
            field: "delete",
            width: 50,
            cellRenderer: (params: any) => (
                <DeleteOutlined
                    style={{ color: "red", cursor: "pointer", fontSize: "18px" }}
                    title="Click to delete this record"
                    onClick={() => handleDelete(params.data.id)}
                />
            ),
        },
        {
            headerName: "S.No",
            field: "sno",
            width: 100,
            cellRenderer: (params: any) => (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <HolderOutlined style={{ cursor: "grab", fontSize: "18px", marginRight: "15px" }} />
                    <span>{params.value}</span>
                </div>
            ),
            sortable: true,
        },
        { headerName: "Store", field: "store" },
        { headerName: "City", field: "city" },
        { headerName: "State", field: "state" },
    ]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            const newStore: StoreData = {
                id: `ST${Date.now()}`,
                seqNo: rowData.length + 1,
                label: values.store,
                city: values.city,
                state: values.state,
            };

            dispatch(addStore(newStore));
            setIsModalOpen(false);
            form.resetFields();
        });
    };

    return (
        <div style={containerStyle}>
            <div className={styles.tableContainer}>
                <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
                    <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} />
                </div>
                <div>
                    <Button
                        style={{
                            marginTop: 10,
                            background: "#ff7f50",
                            border: "none",
                            fontSize: "16px",
                        }}
                        onClick={openModal}
                    >
                        NEW STORE
                    </Button>
                </div>
            </div>

            <Modal
                title="Add New Store"
                open={isModalOpen}
                onOk={handleSave}
                onCancel={() => setIsModalOpen(false)}
                okText="Save"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="store" label="Store Name" rules={[{ required: true, message: "Store Name is required!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="city" label="City" rules={[{ required: true, message: "City is required!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="state" label="State" rules={[{ required: true, message: "State is required!" }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Store;