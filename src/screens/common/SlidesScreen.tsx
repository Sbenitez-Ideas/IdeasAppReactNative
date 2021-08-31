import React, { useContext, useState } from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Slide, slidesItems } from '../../model/classes/common/SlidesData';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { DynamicText } from '../../components/common/DynamicText';
import { useFont } from '../../hooks/common/useFont';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import { useTranslation } from 'react-i18next';

const  { width, height } = Dimensions.get( 'window' );

interface Props extends StackScreenProps<any, any>{};

export const SlidesScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();
    const { bold, semibold } = useFont()
    const [activeIndex, setActiveIndex] = useState(0);
    const { theme: { colors, secondary } } = useContext( ThemeContext );
    const renderItem = ( item: Slide ) => {
        return (
            <View style={{ 
                flex: 1, backgroundColor: 'white', borderRadius: 5, padding: 40, justifyContent: 'center', maxWidth: width
            }}>
                <Image 
                    source={ item.img }
                    style={{ width: 350, height: 400,}}
                    resizeMode='contain'
                />
                <DynamicText fontFamily={ bold } style={{ fontSize: 20, marginBottom: 30, color: colors.primary }}>{ item.title }</DynamicText>
                <DynamicText>{ item.desc }</DynamicText>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{ flex:1 }}
        >
            <Carousel
                data={ slidesItems() }
                renderItem={ ({ item }) => renderItem( item ) }
                sliderWidth={ width }
                itemWidth={ height }
                layout="default"
                onSnapToItem={ ( index ) => {
                    setActiveIndex( index )
                } }
            />
            
            

            { activeIndex === slidesItems().length - 1 &&
                <Animatable.View 
                    style={styles.button}
                    animation="fadeIn"
                >
                    <TouchableOpacity onPress={() => { navigation.navigate( 'LoginScreen' ) }}>
                        <LinearGradient
                            colors={[colors.primary, secondary]}
                            style={styles.signIn}
                        >
                            <DynamicText fontFamily={ semibold } style={styles.textSign}>{ t( 'resContinuar' ) }</DynamicText>
                            <Icon 
                                name="chevron-forward-outline"
                                color="#fff"
                                size={20}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animatable.View>
            }

            <Pagination 
                dotsLength={ slidesItems().length }
                activeDotIndex={ activeIndex }
                dotStyle={{ width: 10, height: 10, borderRadius: 10, backgroundColor: colors.primary }}
            />

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 100,
        height: 40,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
})