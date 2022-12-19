import React, { useContext, useEffect } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View, TouchableWithoutFeedback, Button, TextStyle, StyleProp } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { modDate } from '../../functions/functions';
import { formatDate } from '../../interfaces/interfaces';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppSelector } from '../../app/hooks';
import { CalendarProvider, CalendarContext } from '../../context/CalendarContext';
import { OrientationContext } from '../../context/OrientationContext';
import { TextInput } from '../TextInput';

interface Props {
    calendars: Array<{ label: string, date: Date }>;
    height?: number;
    textColor?: string;
    backgroundColor?: string;
    colorOutline?: string;
    limitDays?: number;
    Textstyle?: StyleProp<TextStyle>;
    hideInputs?: boolean;
    onChange: (dates: Array<{ name: string, date?: formatDate }>) => void;
}

const CalendarState = ({ children }: any) => {
    return (
        <CalendarProvider>
            {children}
        </CalendarProvider>
    )
}

const RenderCalendar = (props: Props) => {
    const { calendars, height, backgroundColor, textColor, colorOutline, onChange, limitDays, Textstyle, hideInputs } = props;
    const { dates, calendarSelected, setInitialDates, setCalendar, onDelete, onSelect } = useContext(CalendarContext);
    const { theme: { fonts } } = useAppSelector(state => state.app);

    useEffect(() => {
        const dates = calendars.map(cal => { return { name: cal.label, date: modDate({ dateI: cal.date }) } });
        setInitialDates(dates);
    }, []);

    useEffect(() => {
        if (dates) onChange(dates);
    }, [dates]);

    const _renderInputs = React.useCallback(() => {
        const minHeight: number = 50;
        if (hideInputs) return undefined;
        if (dates)
            return (
                dates.map((calendar, idx) => {
                    return (
                        <View key={calendar.name + idx} style={[styles.caontainerInput, { height: height ?? minHeight, borderColor: colorOutline ?? 'black' }]}>
                            <TouchableWithoutFeedback onPress={() => setCalendar(calendar.name)}>
                                <View style={{ flexDirection: 'row', height: height ?? minHeight, alignItems: 'flex-end', paddingBottom: 10 }}>
                                    <Text style={[styles.date, Textstyle, fonts.bodyLarge, { color: textColor ?? 'black', fontWeight: 'normal' }]}>{calendar.date?.date.date ?? '--/--/--'}</Text>
                                    <Icon style={{ marginLeft: 10 }} name='calendar' size={minHeight / 1.9} color={textColor} />
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={[styles.containerLabel]}>
                                <Text style={[styles.label, fonts.bodySmall, { color: textColor ?? 'black' }]}>{calendar.name}</Text>
                            </View>
                        </View>
                    )
                })
            )
        return undefined
    }, [dates, backgroundColor, textColor, colorOutline, hideInputs, fonts]);

    const _renderCalendar = React.useCallback(() => {
        const { theme: { roundness, colors } } = useAppSelector(state => state.app);
        const { screenHeight, screenWidth } = useContext(OrientationContext);
        if (calendarSelected && dates)
            return (Platform.OS === 'ios')
                ?
                <Modal visible={calendarSelected !== undefined ? true : false} transparent animationType='fade'>
                    <View style={{ width: screenWidth, height: screenHeight, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                        <Pressable style={{ width: '100%', height: '100%', backgroundColor: colors.backdrop }} onPress={() => {
                            setCalendar(undefined)
                        }} />
                        <View style={{ position: 'absolute', backgroundColor: colors.background, borderRadius: roundness * 2, padding: 10 }} >
                            <DateTimePicker
                                display={'inline'}
                                locale="es-ES"
                                value={dates.find(f => f.name === calendarSelected)?.date?.DATE ?? new Date()}
                                mode={'date'}
                                minimumDate={limitDays ? modDate({ days: -limitDays }).DATE : undefined}
                                maximumDate={modDate({}).DATE}
                                onChange={({ nativeEvent: { timestamp }, type }) => {
                                    if (calendarSelected && timestamp) {
                                        const date = modDate({ dateI: new Date(timestamp) });
                                        onSelect({ name: calendarSelected, date });
                                    }
                                }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Button title='Cancelar' onPress={() => {
                                    setCalendar(undefined);
                                }} />
                            </View>
                        </View>
                    </View>
                </Modal>
                :
                (calendarSelected !== undefined) &&
                <DateTimePicker
                    display={'default'}
                    value={dates.find(f => f.name === calendarSelected)?.date?.DATE ?? new Date()}
                    mode={'date'}
                    minimumDate={limitDays ? modDate({ days: -limitDays }).DATE : undefined}
                    maximumDate={modDate({}).DATE}
                    onChange={({ nativeEvent: { timestamp }, type }) => {
                        if (calendarSelected && timestamp) {
                            const date = modDate({ dateI: new Date(timestamp) });
                            onSelect({ name: calendarSelected, date });
                        }
                    }}
                />
        return undefined;
    }, [calendarSelected])

    return (
        <View style={[styles.containerInputs]}>
            {_renderInputs()}
            {_renderCalendar()}
        </View>
    )
}

export const Calendar = (props: Props) => {
    return (
        <CalendarState>
            <RenderCalendar {...props} />
        </CalendarState>
    );
}



const styles = StyleSheet.create({
    containerInputs: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    caontainerInput: {
        // borderBottomWidth: 1,
        borderWidth: .2,
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 10,
        marginBottom: 4,
        marginHorizontal: 1,
        borderRadius: 5,

    },
    containerLabel: {
        position: 'absolute',
        top: 2,
        left: 0,
    },
    label: {
        fontSize: 11,
        paddingHorizontal: 10
    },
    date: {
        paddingBottom: 3
    }
});
