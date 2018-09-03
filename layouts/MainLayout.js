import React from 'react';
import {NavHeader} from '../components/NavHeader/NavHeader';

export const MainLayout = ({children, ...rest}) => (
    <div>
        <NavHeader {...rest} />
        {children}
    </div>
)