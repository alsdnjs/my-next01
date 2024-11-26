import React from 'react';

function layout({children}) {
    return (
        <>

            <h3>CREATE 부모 컴포넌트 시작</h3>
            {children}
            <h3>CREATE 부모 컴포넌트 시작</h3>
        </>
    );
}

export default layout;