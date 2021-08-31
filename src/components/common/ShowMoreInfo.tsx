import React, { useContext, useEffect, useState } from 'react'
import { useFont } from '../../hooks/common/useFont';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { TouchableOpacity, View } from 'react-native';
import { DynamicText } from './DynamicText';
import LinearGradient from 'react-native-linear-gradient';
import { Segment } from '../../model/classes/flights/business-objects/Segment';

interface Props {
    arrayData: Segment[];
}


export const ShowMoreInfo = ( { arrayData }: Props ) => {

    const { theme: { colors, lightGray  } } = useContext( ThemeContext );
    const { semibold } = useFont();
    const [items, setItems] = useState<{ items: Segment[], opened: boolean }[]>([]);


    useEffect(() => {
        if ( arrayData.length > 3 ) {
            let count = 1;
            let segments: Segment[] = [];
            let data: { items: Segment[], opened: boolean }[] = [];
            arrayData.map(( item, index ) => {
                if (( count % 3 ) === 0 && count !== 0 ) {
                    segments.push( item );
                    data.push( { items: segments, opened: count === 3 ? true : false } )
                    segments = [];
                } else if (( segments.length < 3 && count === ( (arrayData.length + 1 ) - 2 )) || ( segments.length < 3 && count === ( (arrayData.length + 1 ) - 1 )) ) {
                    segments.push( item );
                    if ( ( segments.length < 3 && count === ( (arrayData.length + 1 ) - 1 )) )  {
                        data.push( { items: segments, opened: count === 3 ? true : false } )
                    }
                } else {
                    segments.push( item );
                }
                count ++;
            })

            setItems( data );
        }

    }, [])
    

    const showMoreData = () => {

        if ( items.filter( obj  => !obj.opened).length > 0 ) {
            let index = items.findIndex( obj  => !obj.opened );
            let newArray = [ ...items ];
            newArray[ index ].opened = true;
            setItems( newArray );
        }
    }

    return (
        <View>   
            { 
                items.map(( ig, index ) => {
                    if ( ig.opened ) {
                        return (
                            <View key={ index }>
                                { ig.items.map(( igItem, indexsx ) => {
                                    return (
                                        <DynamicText key={ indexsx } style={{ marginLeft: 30 }}>{ `${ index } ${ igItem }`  }</DynamicText>
                                    )
                                }) }                                  
                            </View>
                        )
                    }
                })

            }
            { items.find( obj => !obj.opened ) &&
                <LinearGradient
                    colors={[ 'transparent', lightGray ]}
                    style={{ padding: 20 }}
                > 
                    <TouchableOpacity onPress={ () => showMoreData() }>
                        <DynamicText fontFamily={ semibold } headline style={{ alignSelf: 'center', color: colors.primary }}> Ver mas vuelos </DynamicText>
                    </TouchableOpacity>
                </LinearGradient>
            }    
        </View>
        
    )
}
