import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const App = ({ getImgUrlUpload, imagenUrl }) => {

  var imgUrl = imagenUrl;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loading, setLoaging] = useState(false);
  const [fileList, setFileList] = useState(imagenUrl !== "Sin imagen" ? [{
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: imagenUrl
  }] : []);


  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = (fileList) => {
    setFileList(fileList["fileList"]);
  };

  const handleRemove = () => {
    imgUrl = "Sin imagen";
    getImgUrlUpload(imgUrl);
  };

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Solo se admiten imagenes JPG/PNG!');
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('El peso maximo de la imagen debe ser de 2MB!');
      return Upload.LIST_IGNORE;
    }

    const isPl100P = await validateImageDimensions(file);
    if (!isPl100P) {
      message.error("La imagen debe ser de almenos 100x100 pixeles!");
      return Upload.LIST_IGNORE;
    }

    setLoaging(true);
    await uploadImage(file);
    setLoaging(false);
    return false;
  };

  const validateImageDimensions = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function () {
          var height = this.height;
          var width = this.width;
          if (height < 100 || width < 100) {
            resolve(false);
          }
          resolve(true);
        };
      };
      reader.onerror = (error) => reject(error);
    });

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      //'http://localhost:8080/api/upload'
      //`${process.env.REACT_APP_SERVERURL}/api/upload/`
      const response = await axios.post(`${process.env.REACT_APP_SERVERURL}/api/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data['imgUrl'] !== "Error") {
        imgUrl = response.data['imgUrl'];
        getImgUrlUpload(imgUrl);
      } else {
        handleRemove();
        message.error('No se pudo subir la imagen, intente nuevamente.');
      }
    } catch (error) {
      handleRemove();
      message.error('No se pudo subir la imagen, intente nuevamente.');
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Subir
      </div>
    </div>
  );

  return (
    <>
      <Upload
        id="upload"
        listType="picture-card"
        defaultFileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        onRemove={handleRemove}
        disabled={loading}
        accept="image/png, image/jpeg"
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};
export default App;