import React, { createRef } from 'react'


export const navigationRef = createRef<any>();


export function navigate (name: any, params?: any )  {
    navigationRef.current?.navigate( name, params );
}
