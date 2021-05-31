import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react'
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { faRoute, faCalendar, faBook } from '@fortawesome/free-solid-svg-icons';
import { DynamicText } from '../common/DynamicText';

export const ActivityItem = () => {
    return (
        <>
            <TouchableOpacity
        style={[styles.listContent, {backgroundColor: '#F5F5F5'}]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>TAG</Text>
          <FontAwesomeIcon 
            icon={ faRoute }
            size={ 18 }
          />
        </View>
        <DynamicText headline semibold numberOfLines={1} style={{marginVertical: 5}}>
            Truckfighters: Performing Gravity X
        </DynamicText>
        <View style={styles.listLineMap}>
          <Text>
            asdas890
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
            <FontAwesomeIcon
                icon={ faCalendar }
                size={ 16 }
            />
          <Text 
          style={{
              marginLeft: 5,
              fontFamily: 'Raleway-Italic'
            }}>
              SIUU
          </Text>
        </View>
        <View style={styles.listRow}>
          <View style={{alignItems: 'flex-start'}}>
            <Text
              style={{
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
              }}>
              566734
            </Text>
            <Text>
              45565
            </Text>
            <Text>tag</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>

                  <FontAwesomeIcon 
                    icon={ faBook }
                    size={ 12 }
                  />
              <Text>
                43455 ticket
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
        </>
    )
}


const styles = StyleSheet.create({
    listLineMap: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      listContent: {
        padding: 10,
        borderRadius: 10,
        width: '100%'
      },
      listRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
      },
})