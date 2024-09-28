import React from 'react';
import CategoryList from './ComponentesCategorias/CategoryList'
import CategoryModal from './ComponentesCategorias/CategoryModal';
import { useState } from 'react';
import { Affix, Layout } from 'antd';

function Categoria() {

    const [isRefresh, setIsRefresh] = useState(true);
    const setRefresh = (status) => {
        setIsRefresh(status);
    }

    const { Header, Content } = Layout;

    return (
        <div>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    background: '#ecdde1'
                }}
                className='header'
                theme
            >
                <div><h1 style={{ fontSize: 50, textAlign: 'center', background: '#ecdde1', textShadow: "2px 2px white" }}>Categoría</h1></div>
            </Header>

            <Content style={{ marginTop: '0%', marginLeft: '3%' }}>
                <Affix offsetTop={64}>
                    <div style={{
                        background: '#f5f5f5',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '8%',
                        alignItems: 'center',
                        height: '75px',
                        marginLeft: '0%'
                    }}>
                        <CategoryModal setRefresh={setRefresh} />
                    </div>
                </Affix>
                <CategoryList setRefresh={setRefresh} isRefresh={isRefresh} />
            </Content>
        </div>
    );
}

export default Categoria;