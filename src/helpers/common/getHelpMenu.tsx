export const getHelpMenu = (): any[] => {

    const menus: any[] = [
        {
            label: 'Compra con asesor',
            route: '',
            icon: "logo-whatsapp",
            external: 'https://api.whatsapp.com/send?phone=573183258347'
        },
        {
            label: 'Cambios y cancelaciones',
            route: '',
            icon: 'repeat',
            external: 'https://zfrmz.com/9yWBZMcjY0BDO5bHoZCf'
        },
        {
            label: 'Asistencia 24 horas',
            route: '',
            icon: 'headset-outline',
            external: 'assistance'
        },
        
    ]


    return menus;
}