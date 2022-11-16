import React, { useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { modDate } from '../functions/functions';
import { formatDate } from '../interfaces/interfaces';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';



interface Props {
    calendars: Array<{ label: string, date: Date }>;
    height?: number;
    textColor?: string;
    backgroundColor?: string;
    colorOutline?: string;
    limitDays?: number;
    onChange: (dates: Array<{ name: string, date?: formatDate }>) => void;
    error?: boolean;
}
export const Calendar = (props: Props) => {
    const { calendars, height, backgroundColor, textColor, colorOutline, onChange, error, limitDays } = props;
    const [dates, setDates] = useState<Array<{ name: string, date?: formatDate }>>();
    const [openCalendar, setopenCalendar] = useState<boolean>(false);

    const onDelete = (name: string) => {
        if (dates) setDates(() => dates.map(dat => (dat.name === name) ? { name } : dat));
    }

    const setDate = () => {
        setDates(calendars.map(cal => { return { name: cal.label, date: modDate({ dateI: cal.date }) } }));
    }

    useEffect(() => {
        setDates(calendars.map(cal => { return { name: cal.label, date: modDate({ dateI: cal.date }) } }));
    }, []);

    useEffect(() => {
        if (dates) onChange(dates);
    }, [dates])


    const _renderInputs = React.useCallback(() => {
        const minHeight: number = 40;
        if (dates)
            return (
                dates.map((calendar, idx) => {
                    return (
                        <Pressable key={calendar.name + idx} onPress={() => { console.log('hshsh') }}>
                            <View style={{ position: 'relative' }}>
                                <View style={[styles.caontainerInput, { height: height ?? minHeight, borderColor: colorOutline ?? 'black' }]}>
                                    <Icon name='calendar' size={minHeight / 1.7} color={textColor} onPress={() => setDate()} />
                                    <Text style={[styles.date, { color: textColor ?? 'black' }]}>{calendar.date?.date.date ?? '--/--/--'}</Text>
                                    {calendar.date && <Icon name='close' size={minHeight / 1.9} color={textColor} onPress={() => onDelete(calendar.name)} />}
                                </View>
                                <View style={[styles.containerLabel, { backgroundColor: backgroundColor ?? 'white' }]}>
                                    <Text style={[styles.label, { color: textColor ?? 'black' }]}>{calendar.name}</Text>
                                </View>
                            </View>
                        </Pressable>
                    )
                })
            )
        return undefined
    }, [dates, backgroundColor, textColor, colorOutline]);

    const _renderCalendar = React.useCallback(() => {
        return (
            <SafeAreaView>
                <Modal visible transparent>
                    <DateTimePicker
                        display={'default'}
                        locale={moment.locale('es')}
                        value={new Date()}
                        mode={'date'}
                        // minimumDate={modDate({ days: -30 }).DATE}
                        // maximumDate={getDate().DATE}
                        onChange={({ nativeEvent, type }) => {

                        }}
                        onTouchCancel={() => {
                            // console.log('cancel');
                        }}
                    />
                </Modal>
            </SafeAreaView>
        )
    }, [openCalendar])

    return (
        <View style={[styles.containerInputs]}>
            {_renderInputs()}
            {_renderCalendar()}
        </View>
    )
}

const styles = StyleSheet.create({
    containerInputs: {
        padding: 5,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    caontainerInput: {
        borderWidth: 1,
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
        paddingHorizontal: 5,
        margin: 6,
        borderRadius: 5
    },
    containerLabel: {
        position: 'absolute',
        height: 15,
        borderRadius: 5,
        top: -2,
        left: 10,
    },
    label: {
        fontSize: 11,
        paddingHorizontal: 5
    },
    date: {
        marginHorizontal: 5
    }
});
