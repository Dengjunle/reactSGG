import React, { Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';

import { BASE_IMG } from '../../../utils/Constants';
import { reqDeleteImg } from '../../../api';
import PropTypes from 'prop-types';
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class PicturesWall extends Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    //获取所有已上传图片文件名的数组
    getImgs = () => this.state.fileList.map(file => file.name);

    handleCancel = () => this.setState({ previewVisible: false });
    //进行大图预览
    //file：当前选择的图片对应的file
    handlePreview = async file => {
        if (!file.url && !file.preview) {//如果file没有图片url，只进行一次base64处理来显示图片
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    //file：当前操作(上传/删除)
    handleChange = async ({ file, fileList }) => {
        //file与fileList中最后一个file代表同个图片的不同对象
        //如果上传成功
        if (file.status === 'done') {
            file = fileList[fileList.length - 1];
            //取出相应数据中的图片文件名
            const { name, url } = file.response.data;
            //保存上传的file对象中
            file.name = name;
            file.url = url;
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name);
            if (result.status === 0) {
                message.success('删除图片成功！');
            } else {
                message.error('删除图片失败！');
            }
        }
        //更新状态
        this.setState({ fileList })
    };

    componentWillMount() {
        //根据传入的imgs生成filelist并更新
        const imgs = this.props.imgs
        if (imgs && imgs.length > 0) {
            const fileList = imgs.map((img, index) => ({
                uid: index,//唯一标识
                name: img,//文件名
                status: 'done',//状态
                url: BASE_IMG + img//图片地址
            }))
            this.setState({ fileList })
        }
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"//上传图片的URL
                    name="image"//图片文件对应参数名
                    listType="picture-card"//显示风格
                    fileList={fileList}//已上传的所有图片文件信息对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall;