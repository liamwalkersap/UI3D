import React from "react";
import { Form, Input } from 'antd';

const formProfile = (props) => {
    return (
        <>
        <div className="messenger-success">File successfully loaded</div>
        <Form className='messenger-form' size='small' labelCol={{ span: 8, }} >
            <Form.Item className='messenger-form-item' label='Loaded Object'>
                <input value={props.fileName} disabled={true} />
            </Form.Item>
        </Form>
        </>
    );
};

export default formProfile;
