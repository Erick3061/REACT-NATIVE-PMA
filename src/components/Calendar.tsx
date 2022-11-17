import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { modDate } from '../functions/functions';
import { formatDate } from '../interfaces/interfaces';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { screenHeight } from '../config/Dimensions';



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
    const [calendar, setCalendar] = useState<string | undefined>(undefined);

    const onDelete = (name: string) => {
        if (dates) setDates(() => dates.map(dat => (dat.name === name) ? { name } : dat));
    }

    const setDate = (date: formatDate) => {
        setDates(calendars.map(cal => { return { name: cal.label, date } }));
    }

    useEffect(() => {
        setDates(calendars.map(cal => { return { name: cal.label, date: modDate({ dateI: cal.date }) } }));
    }, []);

    useEffect(() => {
        if (dates) onChange(dates);
    }, [dates])

    useEffect(() => {
        console.log(calendar);
    }, [calendar])



    const _renderInputs = React.useCallback(() => {
        const minHeight: number = 40;
        if (dates)
            return (
                dates.map((calendar, idx) => {
                    return (
                        <View key={calendar.name + idx} style={[styles.caontainerInput, { height: height ?? minHeight, borderColor: colorOutline ?? 'black' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableWithoutFeedback onPress={() => setCalendar(calendar.name)}>
                                    <View style={{ flexDirection: 'row', height: height ?? minHeight, alignItems: 'flex-end', paddingBottom: 5 }}>
                                        <Icon name='calendar' size={minHeight / 1.7} color={textColor} />
                                        <Text style={[styles.date, { color: textColor ?? 'black' }]}>{calendar.date?.date.date ?? '--/--/--'}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                {calendar.date && <Icon name='close' size={minHeight / 1.9} color={textColor} style={{ marginStart: 5 }} onPress={() => onDelete(calendar.name)} />}
                            </View>
                            <View style={[styles.containerLabel, { backgroundColor: backgroundColor ?? 'white' }]}>
                                <Text style={[styles.label, { color: textColor ?? 'black' }]}>{calendar.name}</Text>
                            </View>
                        </View>
                    )
                })
            )
        return undefined
    }, [dates, backgroundColor, textColor, colorOutline]);

    const _renderCalendar = React.useCallback(() => {
        return (
            <SafeAreaView>
                {
                    (calendar) &&
                    <DateTimePicker
                        display={'default'}
                        locale={moment.locale('es')}
                        value={modDate({}).DATE}
                        mode={'date'}
                        minimumDate={limitDays ? modDate({ days: -limitDays }).DATE : undefined}
                        maximumDate={modDate({}).DATE}
                        onChange={({ nativeEvent, type }) => {
                            console.log(nativeEvent, type);
                            setCalendar(undefined)
                            // const date: formatDate = modDate({ dateI: nativeEvent.timestamp ? new Date(nativeEvent.timestamp) : show.start.open ? show.start.date.DATE : show.end.date.DATE })
                        }}
                    />
                }
            </SafeAreaView>
        )
    }, [calendar])

    return (
        <View style={[styles.containerInputs]}>
            {_renderInputs()}
            {_renderCalendar()}
        </View>
    )
}

const styles = StyleSheet.create({
    containerInputs: {
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
        marginTop: 10,
        marginBottom: 4,
        borderRadius: 5
    },
    containerLabel: {
        position: 'absolute',
        height: 15,
        borderRadius: 5,
        top: -10,
        left: 10,
    },
    label: {
        fontSize: 11,
        paddingHorizontal: 5
    },
    date: {
        marginHorizontal: 3,
        paddingBottom: 3
    }
});
