import React, { useEffect, useState } from 'react'
import AwesomeAlert from 'react-native-awesome-alerts';
import { colors } from 'react-native-elements';
import { useFont } from '../../hooks/common/useFont';
import { useTranslation } from 'react-i18next';

interface Props {
    type: string;
    title: string;
}

export const Information = ({ type, title }: Props) => {

    const [info, setInfo] = useState<string>('');
    const { t } = useTranslation();
    const { semibold } = useFont();
    const [showAlert, setShowAlert] = useState<boolean>(true);


    useEffect(() => {
        setTypeParams();
    }, [])

    const setTypeParams = () => {
        switch (type) {
            case 'product':
                setProductInfo();
                break;
            case 'approver':
                setInfo(  t( 'resNoTieneAprobador' ) );
            default:
                break;
        }
    }

    const setProductInfo = () => {
        switch ( title ) {
            case 'Transporte Especial':
                setInfo( 'El transporte especial debe ser solicitado mínimo para ' +
                'tres funcionarios a excepción de gerentes, directores, vicepresidentes y presidente' );
                break;
            case 'Transporte Intermunicipal':
                setInfo( 'Aquí podrás solicitar los transportes de bus entre ciudades ' +
                'y municipios, también podrás solicitar taxis desde y hacia el aeropuerto.' );
                break;
            case 'Viaticos':
                setInfo( 'La manutención de tus viáticos serán liquidados de acuerdo ' +
                'a tu hora de viaje de ida y regreso. (Consulta las políticas de viaje)' );
                break;
            default:
                break;
        }
    }




    return (
        <>
            <AwesomeAlert 
                messageStyle={{ fontSize: 15, fontFamily: 'Raleway-Regular' }}
                titleStyle={{ color: colors.primary, fontFamily: semibold, textTransform: 'uppercase' }}
                show={ showAlert }
                title={ title }
                message={ info }
                showConfirmButton={ true }
                confirmButtonColor={ colors.primary }
                confirmText={ t( 'resConfirmar' ) }
                confirmButtonTextStyle={{ textTransform: 'uppercase', fontFamily: semibold }}
                onConfirmPressed={ () => {
                    setShowAlert( false );
                }}
            />
        </>
    )
}
