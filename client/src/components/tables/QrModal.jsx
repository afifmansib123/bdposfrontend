import React, { useEffect, useState } from "react";
import { Modal, Form } from "antd";
import QRCode from "react-qr-code";
import "./style.css";

const QrModal = ({ isAddModalOpen, setIsAddModalOpen, tableId }) => {
    const [qrUrl, setQrUrl] = useState('');

    useEffect(() => {
        const generateQrCode = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/tokens/generate-token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tableId }),
                });
                const data = await response.json();
                setQrUrl(data.qrUrl);
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        };

        if (tableId) {
            generateQrCode();
        }
    }, [tableId]);

    return (
        <>
            <Modal
                className="flex items-center"
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                footer={false}
            >
                <Form>
                    <Form.Item className="flex justify-center mt-10">
                        {qrUrl ? <QRCode value={qrUrl} /> : 'Generating QR Code...'}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default QrModal;
