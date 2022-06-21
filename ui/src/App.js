import "./App.css";

/* Resources */
import logoApp from './resources/logoApp.png';
import logoCompany from './resources/logoCompany.png';

/* React */
import React, { useEffect, useRef, useState, Suspense } from 'react'

/* Ant Design */ 
import { Form, Button, Row, Col, Table, Layout, Select, Avatar, Spin, Input } from 'antd';
import { UserOutlined, SketchSquareFilled } from '@ant-design/icons';

/* Three / Fiber / DREI */ 
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center } from "@react-three/drei";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
//import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

/* Misc */
import { SketchPicker } from 'react-color';
import { Buffer } from 'buffer';
import axios from "axios";

import Model from './components/editor/Model.js';
import FormFile from './components/messenger/FormFile.js';
import { setDefaultResultOrder } from "dns";
const filesaver = require('file-saver');

//var vcapServices = require('vcap_services');//
//var credentials = vcapServices.findCredentials({ service: 'personality_insights' });
//console.log(credentials);

/* 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 */
/* 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 */
/* APP */
const App = () => {

    const customers = [
        { id: '188040439843', name: 'Temp Perpetual', type: 'P', status: 'A' },
        { id: '1', name: 'John Doe', type: 'P', status: '' },
        { id: '3985973950', name: 'John Doe', type: 'S', status: 'A' },
        { id: '3176169607', name: 'Jane Doe', type: 'S', status: 'E' },
        { id: '801737744', name: 'Jane Smith', type: 'S', status: 'E' },
        { id: '5053683532', name: 'John Smith', type: 'S', status: 'A' },
        { id: '1925865', name: 'Joe Bloggs', type: 'S', status: 'A' },
        { id: '9000000001', name: 'Jane Bloggs', type: 'P', status: 'A' },
        { id: '9000000002', name: 'Joseph Bloggs', type: 'P', status: 'A' },
        { id: '9000000003', name: 'Joseph Smith', type: 'P', status: 'A' },
        { id: '9000000004', name: 'Marcie Ssith', type: 'P', status: 'E' },
        { id: '9000000005', name: 'Nina Smith', type: 'P', status: 'E' },
    ];

    const States = {
        LICENSE_CHECK: 'LICENSE_CHECK', LICENSE_SUCCESS: 'LICENSE_SUCCESS', LICENSE_FAILURE: 'LICENSE_FAILURE',
        PROFILE_GET: 'PROFILE_GET', PROFILE_GET_SUCCESS: 'PROFILE_GET_SUCCESS', PROFILE_GET_FAILURE: 'PROFILE_GET_FAILURE',
        PROFILE_SET: 'PROFILE_SET', PROFILE_SET_SUCCESS: 'PROFILE_SET_SUCCESS', PROFILE_SET_FAILURE: 'PROFILE_SET_FAILURE',
        COLOR_SET: 'COLOR_SET', LOAD_FILE: 'LOAD_FILE', LOAD_SUCCESS: 'LOAD_SUCCESS', LOAD_FAILURE: 'LOAD_FAILURE',
        ESTIMATE_PRINT: 'ESTIMATE_PRINT', ESTIMATE_SUCCESS: 'ESTIMATE_SUCCESS', ESTIMATE_FAILURE: 'ESTIMATE_FAILURE',
        UPLOAD_FILE: 'UPLOAD_FILE', UPLOAD_SUCCESS: 'UPLOAD_SUCCESS', UPLOAD_FAILURE: 'UPLOAD_FAILURE'
    } 
 
    const [customerID, setCustomerID] = useState('188040439843');
    const [fileName, setFileName] = useState("");

    const url = {
        LICENSE_P: `/plicense/License?$filter=UserID%20eq%20%27${customerID}%27`,
        LICENSE_S: `/slicense/`,
        PROFILE: '/profile/ZZ1_CUSTOMER_CDS/ZZ1_CUSTOMER',
        ESTIMATE: `/estimate/`,
        UPLOAD: `/upload/`
    };

    const { Header, Footer, Content } = Layout;  //antd layout
    const { Option } = Select;

    const [state, setState] = useState(States.LICENSE_CHECK);
    const [estimateData, setEstimateData] = useState([]);
    const [geom, setGeom] = useState(null);
    const [file, setFile] = useState(null);
    const [encoded, setEncoded] = useState(null);

    const [licenseValid, setLicenseValid] = useState(false);
    const [loadValid, setLoadValid] = useState(false);
    const [color, setColor] = useState("#003366");
    const [profile, setProfile] = useState({});
    const [upload, setUpload] = useState({});
    const [token, setToken] = useState('');

    const ref = useRef();

    let fileHandle;

    //var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
    //console.log(vcap_services);

    /* 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 */
    /* 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 */
    /* Hooks */
    useEffect(() => {
        console.log(`useEffect()`);
        check_plicense();
    }, []);

    /* 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 */
    /* 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 */
    /* Classes and Functions */

    // function get_user_info() {
    //     setTimeout(() => {
    //         let myPath = window.location.pathname
    //         let myPathWithoutFile = myPath.substring(0, myPath.lastIndexOf('/'))
    //         fetch(myPathWithoutFile + "/user-api/currentUser").then((res) => {
    //             return res.json();
    //         }).then((user) => {
    //             document.getElementsByTagName("body")[0].innerText = `Hi ${user.firstname}!`
    //         });
    //     }, 1000);
    // }

    function logFunctionCall(name) {
        console.log(`--${name}`);
    }

    function logComponentCall(name) {
        // console.log(`--${name}`);
    }

    function setStateLogged(pState) {
        console.log(`    set state = ${pState}`);
        setState(pState);
    }

    function onCustomerChange(event) {
        logFunctionCall('onCustomerChange()');
        setCustomerID(event.target.value);
    };

    function onStateChange(event) {
        logFunctionCall('onStateChange()');

        setStateLogged(event.target.value);

        switch (event.target.value) {
            case States.LICENSE_CHECK:
                check_plicense();
                break;
            case States.LICENSE_SUCCESS:
                setLicenseValid(true);
                get_profile_data();
                break;
            case States.LICENSE_FAILURE:
                setLicenseValid(false);
                setLoadValid(false);
                break;
            case States.PROFILE_GET:
                get_profile_data();
                break;
            case States.PROFILE_SET:
                get_profile_data();
                break;
            case States.LOAD_FILE:
                loadFile();
                break;
            case States.LOAD_SUCCESS:
                setLoadValid(true);
                break;
            case States.LOAD_FAILURE:
                setLoadValid(false);
                break;
            case States.ESTIMATE_PRINT:
                get_estimate();
                break;
            case States.ESTIMATE_SUCCESS:
                if (estimateData.length === 0) {
                    const dataSource = [];
                    let obj = {};
                    obj.key = '123';
                    obj.name = 'Gold';
                    obj.price = '$100,000.00'
                    dataSource.push(obj);
                    setEstimateData(dataSource);
                }
                break;
            case States.UPLOAD_FILE:
                upload_file();
                break;
            case States.UPLOAD_SUCCESS:
                break;
            case States.UPLOAD_FAILURE:
                break;
            default:
        }
    }

    const loadFile = async () => {
        logFunctionCall('loadFile()');

        [fileHandle] = await window.showOpenFilePicker();
        try {
            //Show File Open Dialog

            const file = await fileHandle.getFile();
            const contents = await file.arrayBuffer();
            setFile(file);
            //setFile(new File(file, fileName));

            var buffer = Buffer.from(contents);
            let base64data = buffer.toString('base64');

            //Load Geometry with STL Loader
            const loader = new STLLoader();
            let geom = loader.parse(contents);


            setGeom(geom);
            setFileName(fileHandle.name);
            setEncoded(base64data);
            setStateLogged(States.LOAD_SUCCESS);
            setLoadValid(true);


            //      var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
            //filesaver.savas(blob, "hellow.txt");
        }
        catch (e) {
            setStateLogged(States.LOAD_FAILURE);
        }

    }

    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    async function check_plicense() {
        logFunctionCall('check_plicense()');

        try {
            const config = {
                method: 'get',
                url: url.LICENSE_P
            }

            const res = await axios(config)

            if (res.status === 200 && res.data.value[0].ID !== undefined) {
                console.log('    ' + JSON.stringify(res.data.value[0]));
                setLicenseValid(true);
                get_profile_data();
            } 
            else {
                check_slicense();
            }
        }
        catch (e) {
            check_slicense();
        }
    }  

    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    async function check_slicense() {
        logFunctionCall('check_slicense()');

        try {
            const config = {
                method: 'get', 
                url: url.LICENSE_S,
                headers: { 'customer': customerID }
            }

            const res = await axios(config)

            console.log('    ' + JSON.stringify(res.data));
            if (res.status === 200 && res.data.status !== undefined && res.data.status.length > 0 && res.data.status[0] === 'Active') {
                console.log('    ' + JSON.stringify(res.data.status[0]));
                setLicenseValid(true);
                get_profile_data();
            }
            else {
                setLicenseValid(false);
                setLoadValid(false);
                setStateLogged(States.LICENSE_FAILURE);
            }
        }
        catch (e) {
            setLicenseValid(false);
            setLoadValid(false);
            setStateLogged(States.LICENSE_FAILURE);
        }
    }

    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    async function get_profile_data() {
        logFunctionCall('get_profile_data()');

        const config = {
            method: 'get',
            url: url.PROFILE + `?$filter=customerId%20eq%20%27${customerID}%27` ,
            headers: { 'x-csrf-token': 'Fetch' }
        }

        try {
            const res = await axios(config);

            if (res.status === 200 && res.data.d.results.length > 0) {
                const data = res.data.d.results[0];
                const clean = {
                    'SAP_UUID': data.SAP_UUID,
                    'customerId': data.customerId,
                    'firstName': data.firstName,
                    'lastName': data.lastName,
                    'licenseId': data.licenseId,
                    'licenseStatus': data.licenseStatus,
                    'shapewaysId': data.shapewaysId,
                    'typeOfId': data.typeOfId
                }
                setProfile(clean);
                console.log('    ' + JSON.stringify(res.data.d.results[0]));
                setStateLogged(States.PROFILE_GET_SUCCESS);
                setToken(res.headers['x-csrf-token']);
            }
            else
                setStateLogged(States.PROFILE_GET_FAILURE);
        }
        catch (e) {
            setStateLogged(States.PROFILE_GET_FAILURE);
        }
    }

    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    async function set_profile_data(event) {
        logFunctionCall('set_profile_data()');

        if (event !== undefined) {
            console.log('Success:', JSON.stringify(event));
            profile.shapewaysId = event.shapewaysId;
        }

        try {
            const config = {
                method: 'post',
                url: url.PROFILE + 'Sap_upsert',
                params: {
                 //   'SAP_UUID': `'${profile.SAP_UUID}'`,
                    'customerId': `'${profile.customerId}'`, 
                    'firstName': `'${profile.firstName}'`,
                    'lastName': `'${profile.lastName}'`,
                    'licenseId': `'${profile.licenseId}'`,
                    'licenseStatus': `'${profile.licenseStatus}'`,
                    'shapewaysId': `'${profile.shapewaysId}'`,
                    'typeOfId': `'${profile.typeOfId}'`
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'x-csrf-token': token
                }
            };

            const res = await axios(config);

            if (res.status === 200 && res.data.d.customerId !== undefined) {
                const data = res.data.d;
                const clean = {
                    'SAP_UUID': data.SAP_UUID,
                    'customerId': data.customerId,
                    'firstName': data.firstName,
                    'lastName': data.lastName,
                    'licenseId': data.licenseId,
                    'licenseStatus': data.licenseStatus,
                    'shapewaysId': data.shapewaysId,
                    'typeOfId': data.typeOfId
                }
                setProfile(clean);
                console.log('    ' + JSON.stringify(clean));
                setStateLogged(States.PROFILE_SET_SUCCESS);
            }
            else
                setStateLogged(States.PROFILE_SET_FAILURE);
        }
        catch (e) {
            setStateLogged(States.PROFILE_SET_FAILURE);
        }
    };

    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    async function get_estimate() {
        logFunctionCall('get_estimate()');

        setStateLogged(States.ESTIMATE_PRINT);
        let body = {};

        if (encoded != null) {
            body.fileName = fileName;
            body.file = encoded;
            body.description = "Sent from 3dApp";
            body.hasRightsToModel = 1;
            body.acceptTermsAndConditions = 1;
        } else {
            setStateLogged(States.ESTIMATE_FAILURE);
            return;
        }

        const config = {
            method: 'post',
            url: url.ESTIMATE,
            headers: { 'Content-type': 'application/json' },
            data: JSON.stringify(body),
        }

        try {
            const res = await axios(config);

            console.log('    ' + JSON.stringify(res.data));
            if (res.status === 200 && res.data.materialslist !== undefined && res.data.materialslist.length > 0) {
                const dataSource = [];
                for (const [key, value] of Object.entries(res.data.materialslist)) {
                    let obj = {};
                    obj.key = key;
                    obj.name = value.name;
                    obj.price = '$' + value.price
                    dataSource.push(obj);
                }
                setEstimateData(dataSource);
                setStateLogged(States.ESTIMATE_SUCCESS);
            }
            else
                setStateLogged(States.ESTIMATE_FAILURE);
        }
        catch (e) {
            setStateLogged(States.ESTIMATE_FAILURE);
        }
    }

    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    async function upload_file() {
        logFunctionCall('upload_file()');

        const form = new FormData();

        console.log(file.ggetRNFetchBlobRef)
        if (encoded != null) {
            form.append('file', file);
        } else {
            setStateLogged(States.UPLOAD_FAILURE);
            return;
        }

        const config = {
            method: 'post',
            url: url.UPLOAD,
            params: { 'path': `/${customerID}/${fileName}`, 'overwrite': true },
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'fPdb1eSZcIJWVtoxhTmcHfGjY6DrzFz3'
            },
            data: form,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        }


        axios(config).catch(error => {
            setStateLogged(States.UPLOAD_FAILURE);
        }).then(response => {
            if (response.status === 200) {
                setUpload(response.data);
                console.log('    ' + JSON.stringify(response.data));
                setStateLogged(States.UPLOAD_SUCCESS);
            }
            else {
                setStateLogged(States.UPLOAD_FAILURE);
            }

        });

    };

    /* 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 */
    /* 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 */
    /******************************************************************************************* */
    /* HEADER COmponents */
    /******************************************************************************************* */
    const Header3D = () => {
        logComponentCall('Header3D');

        const ProfileButton = () => {
            if (licenseValid) {
                return (<>
                    <Avatar size="large" icon={<UserOutlined />} onClick={get_profile_data} />
                </>
                );
            } else {
                return (<></>);
            }
        }

        return (
            <Row className='Row-Content'>
                <Col span={4} order={1} className='header-column-left'>
                    <img src={logoApp} className='header-image' alt='logo' />
                </Col>
                <Col span={20} order={2} className='header-column-right'>
                    <ProfileButton />
                </Col>
            </Row>
        );
    }

    /******************************************************************************************* */
    /* BODY  */
    /******************************************************************************************* */
    const Console = () => {
        logComponentCall('Console');

        return (
            <div className='console'>
                <Form size='small'>
                    <Form.Item className='console-form-item' >
                        <Button id="buttonLoadFile" className="console-button" onClick={() => loadFile()} disabled={!licenseValid} >Load 3D File</Button>
                    </Form.Item>
                    <Form.Item className='console-form-item' >
                        <Button id="buttonSetColor" className="console-button" onClick={() => setStateLogged(States.COLOR_SET)} disabled={!loadValid}>Set Object Color</Button>
                    </Form.Item>
                    <Form.Item className='console-form-item' >
                        <Button id="buttonEstimatePrint" className="console-button" onClick={() => get_estimate()} disabled={!loadValid}>Estimate 3D Print</Button>
                    </Form.Item>
                    <Form.Item className='console-form-item' >
                        <Button id="buttonUploadFile" className="console-button" onClick={() => upload_file()} disabled={!loadValid}>Upload File to Cloud </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    const Editor = () => {
        logComponentCall('Editor');

        if (encoded != null) {
            return (
                <div className="editor-panel">
                    <Canvas
                        camera={{ position: [0, 10, -100] }}
                        colorManagement
                        shadowMap
                        className="editor-canvas">

                        {/*<KeyLight brightness={5.6} color="#ffbdf4" />*/}
                        {/*<FillLight brightness={2.6} color="#bdefff" />*/}
                        {/*<RimLight brightness={54} color="#fff" />*/}

                        <Suspense fallback={null}>
                            <Center alignTop>
                                <mesh ref={ref} visible castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, 0]}>
                                    <Model geom={geom} castShadow />
                                    <meshStandardMaterial
                                        attach="material"
                                        color={color}
                                        transparent
                                        roughness={.3}
                                        metalness={0.3}
                                    />
                                </mesh>
                            </Center>
                            <ambientLight intensity={.6} />
                            {/*<pointLight color="#ffbdf4" intensity={.7} position={[0, 10, -50]} castShadow />*/}

                            <spotLight color="#fff" intensity={3} position={[-20, 5, -80]} castShadow />
                            <spotLight color="#fff" intensity={1} position={[20, 5, 80]} castShadow />
                            <spotLight color="#fff" intensity={1} position={[0, 5, 40]} />
                            <spotLight color="#fff" intensity={1} position={[5, -30, 3]} />

                            {/* <pointLight color="white" intensity={1} position={[30, -30, -30]} />*/}
                            {/*<KeyLight brightness={35.6} color="#ffbdf4" />*/}
                            {/*<FillLight brightness={63.6} color="#bdefff" position="{[-30,-5,-30]}" />*/}
                            {/*<FillLight brightness={63.6} color="#bdefff" position="{[1,5,1]}" />*/}
                            {/*<RimLight brightness={54} color="#fff" />*/}

                            {/*<directionalLight*/}
                            {/*    intensity={0.5}*/}
                            {/*    castShadow*/}
                            {/*    shadow-mapSize-height={512}*/}
                            {/*    shadow-mapSize-width={512}*/}
                            {/*/>*/}
                        </Suspense>
                        <OrbitControls />
                    </Canvas>
                </div>
            )
        }
        else {
            return (<div className="editor-panel"></div>);
        }

    }

    const MessengerProfile = () => {
        logComponentCall('MessengerProfile');

        return (
            <Form className='messenger-form' size='small' labelCol={{ span: 9, }} wrapperCol={{ span: 13 }} onFinish={set_profile_data}
                initialValues={{
                    "name": profile.firstName + ' ' + profile.lastName,
                    "customerId": profile.customerId,
                    "licenseId": profile.licenseId,
                    "typeOfId": profile.typeOfId,
                    "licenseStatus": profile.licenseStatus
                }}>
                <Form.Item className='messenger-form-item' name='name' label='Name'>
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item className='messenger-form-item' name='customerId' label='Customer ID'>
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item className='messenger-form-item' name='licenseId' label='License ID'>
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item className='messenger-form-item' name='typeOfId' label='License Type'>
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item className='messenger-form-item' name='licenseStatus' label='License Status'>
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item className='messenger-form-item' name='shapewaysId' label='Shapeways Account'>
                    <Input defaultValue={profile.shapewaysId} />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit" >Save</Button>
                </Form.Item>
            </Form>
        );
    }



    const MessengerUpload = () => {
        logComponentCall('MessengerUpload');

        return (
            <>
                <div className="messenger-success">File {fileName} successfully upload to S3</div>
                <Form className='messenger-form' size='small' labelCol={{ span: 9, }} wrapperCol={{ span: 13 }} onFinish={set_profile_data}>
                    <Form.Item className='messenger-form-item' label='Created'>
                        <input value={upload.createdDate} disabled={true} readOnly={true} />
                    </Form.Item>
                    <Form.Item className='messenger-form-item' label='Encoding'>
                        <input value={upload.encoding} disabled={true} />
                    </Form.Item>
                    <Form.Item className='messenger-form-item' label='ID'>
                        <input value={upload.ID} disabled={true} />
                    </Form.Item>
                    <Form.Item className='messenger-form-item' label='Name'>
                        <input value={upload.name} disabled={true} />
                    </Form.Item>
                    <Form.Item className='messenger-form-item' label='Path'>
                        <input value={upload.path} disabled={true} />
                    </Form.Item>
                </Form>
            </>
        );
    }
    class Picker extends React.Component {
        handleChangeComplete = (color, event) => {
            setColor(color.hex);
        };

        render() {
            return <SketchPicker color={color} onChangeComplete={this.handleChangeComplete} />;
        }
    }

    const SpinOn = () => {
        return (<Spin spinning={true} size="large" delay={500} />);
    }

    const SpinOff = () => {
        return (<Spin spinning={false} size="large" delay={500} />);
    }

    const Messenger = () => {
        logComponentCall('Messenger');

        let comp;

        switch (state) {
            case States.LICENSE_CHECK:
                comp = <SpinOn />
                break;
            case States.LICENSE_SUCCESS:
                comp = <MessengerProfile />;
                break;
            case States.LICENSE_FAILURE:
                comp = <div className="messenger-error">You do not have an active license.<br />Please contact The Digital Graphics Company.</div>;
                break;

            case States.PROFILE_GET_SUCCESS:
            case States.PROFILE_SET_SUCCESS:
                comp = <MessengerProfile />;
                break;
            case States.PROFILE_GET_FAILURE:
                comp = <div className="messenger-error">An error occured while attempting to retrieve the user profile<br />Please contact The Digital Graphics Company.</div>;
                break;
            case States.PROFILE_SET_FAILURE:
                comp = <div className="messenger-error">An error occured while attempting to update the user profile<br />Please contact The Digital Graphics Company.</div>;
                break;
            case States.LOAD_SUCCESS:
                comp = <FormFile fileName={fileName} />;
                break;
            case States.LOAD_FAILURE:
                comp = <div className="messenger-error">An error occurred. Unable to load .STL file</div>;
                break;
            case States.COLOR_SET:
                comp = <Picker />;
                break;
            case States.ESTIMATE_PRINT:
                comp = <SpinOn />
                break;
            case States.ESTIMATE_SUCCESS:
                const columns = [
                    {
                        title: 'Material',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: 'Price',
                        dataIndex: 'price',
                        key: 'price',
                    }
                ];

                comp = <Table dataSource={estimateData} columns={columns} size='small' />;
                break;
            case States.ESTIMATE_FAILURE:
                comp = <div className="messenger-error">An error occured.  Unable to retrieve 3D print estimates, for this model</div>;
                break;
            case States.UPLOAD_SUCCESS:
                comp = <MessengerUpload />;
                break;
            case States.UPLOAD_FAILURE:
                comp = <div className="messenger-error">An error occured.  Unable to upload File {fileName} to S3</div>;
                break;
            default:
                comp = <></>;
                break;
        }

        return (<div className="messenger">{comp}</div>);
    }

    const Body3D = () => {
        logComponentCall('Body3D');

        return (
            < Row className='Row-Content' >
                <Col span={4} order={1} className='column-body'>
                    <Console />
                </Col>
                <Col span={14} order={2} className='column-body'>
                    <Editor />
                </Col>
                <Col span={6} order={3} className='column-body'>
                    <Messenger />
                </Col>
            </Row >
        );
    }

    /******************************************************************************************* */
    /* FOOTER COMPONENTS */
    /******************************************************************************************* */
    const Footer3D = () => {
        logComponentCall('Footer3D');

        let customerList = customers.length > 0 && customers.map((item, i) => {
            return (
                <option key={i} value={item.id}>{`${item.id} - ${item.name} - ${item.type} - ${item.status}`}</option>
            )
        }, this);

        return (
            <Footer className='Footer'>

                {<Row className='Row-Content'>
                    <Col span={6} order={1} className='footer-column-left'>
                        <label>current Customer </label>
                        <input value={customerID} disabled={true} />
                    </Col>
                    <Col span={6} order={1} className='footer-column-left'>
                        <label>set Customer </label>
                        <select value={customerID} onChange={onCustomerChange}>
                            {customerList}
                        </select>
                    </Col>
                    <Col span={6} order={2} className='footer-column-left'>
                        <label>set State </label>
                        <select value={state} onChange={onStateChange}>
                            {Object.keys(States).map(key => (
                                <option key={key} value={key}>
                                    {States[key]}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col span={6} order={3} className='footer-column-right'>
                        <img src={logoCompany} className='company-logo' alt='logo' />
                    </Col>
                </Row>}
            </Footer>
        );
    }

    /******************************************************************************************* */
    return (
        <div className="App">
            <Layout className='layout' >
                <Header3D />
                <Body3D />
                <Footer3D />
            </Layout >
        </div >);
};

export default App;
