import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList, ListRenderItemInfo } from 'react-native';
import _ from 'lodash';
import { Row } from './Row';
import { IconButton, Surface } from 'react-native-paper';
import { SimpleSelect } from '../select/SimpleSelect';
import { HeaderTableValues } from '../../types/types';
import { screenWidth } from '../../config/Dimensions';
import { stylesApp } from '../../App';
import { TableProvider, TableContext } from '../../context/TableContext';
import { time } from '../../interfaces/interfaces';
import useCallback from 'react';


type Props = {
    Header?: {
        title?: string;
        subtitle?: string;
    }
    isShowHeader?: boolean;
    Data: any;
    titles: HeaderTableValues;
    fontSize: number;
    scrollRefHeader?: React.RefObject<ScrollView>;
    pagination?: {
        iconBackgroundColor: string;
    };
    isDataObject?: boolean;
    showIndices?: boolean;
    colorBackgroundTable?: string;
}

const TableState = ({ children }: any) => {
    return (
        <TableProvider>
            {children}
        </TableProvider>
    )
}

const RenderTable = ({ Header, Data, titles, fontSize, scrollRefHeader, pagination, isDataObject, isShowHeader = true, showIndices, colorBackgroundTable }: Props) => {
    const [events, setEvents] = useState<Array<any>>();
    const [filter, setfilter] = useState<Array<any>>();
    const numberOfItemsPerPageList = [15, 25, 35, 50];
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPage, setdNumberOfItemsPerPage] = useState(numberOfItemsPerPageList[0]);
    const { data } = useContext(TableContext);

    useEffect(() => {
        if (Array.isArray(Data)) {
            const data = Data.map((events, idx) => {
                let arr = titles.map(el => el.keys?.map(key => String(_.get(events, key))).join(''));
                return arr;
            });
            setEvents(data);
            setfilter(pagination ? data.slice(0, numberOfItemsPerPage) : data);
        }
    }, [Data, titles, pagination]);

    useEffect(() => {
        if (events) {
            setfilter(events.slice(0, numberOfItemsPerPage));
        }
    }, [numberOfItemsPerPage]);

    useEffect(() => {
        setPage(0);
        console.log('entro');
    }, []);

    //version erick

    const _renderPagination = React.useCallback(() => {
        if (events && pagination) {
            const from = page * numberOfItemsPerPage;
            const to = Math.min((page + 1) * numberOfItemsPerPage, events.length);

            return (
                <View style={[styles.containerPagination]}>
                    <View>
                        <SimpleSelect
                            data={numberOfItemsPerPageList}
                            onChange={value => setdNumberOfItemsPerPage(value)}
                            value={numberOfItemsPerPage}
                            Width={50}
                        />
                        <Text style={{ fontWeight: 'bold', padding: 3 }}>Filas</Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', paddingHorizontal: 5 }}>{`${from + 1}-${to} of ${events.length}`}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <IconButton icon={'skip-previous-outline'} onPress={() => { }} />
                        <IconButton icon={'chevron-left'} onPress={() => {
                            setPage(page - 1)
                        }} />
                        <IconButton icon={'chevron-right'} onPress={() => {
                            if (to <= events.length) {
                                setPage(page + 1);
                            }
                        }} />
                        <IconButton icon={'skip-next-outline'} onPress={() => { }} />
                    </View>
                </View>
            )
        }
        return undefined
    }, [events, pagination, numberOfItemsPerPage, page, numberOfItemsPerPageList]);

    const _renderHeader = React.useCallback(() => {
        if (Header)
            return (
                <View style={{ paddingVertical: 5 }}>
                    {Header.title && <Text style={styles.textTitlesHeader}>{Header.title}</Text>}
                    {Header.subtitle && <Text style={styles.textTitlesHeader}>{Header.subtitle}</Text>}
                </View>
            )
        return undefined;
    }, [Header])

    const _renderTH = React.useCallback(() => {
        if (titles && isShowHeader)
            return (
                <Row tamCol={titles.map(s => { return { size: s.size ?? 10, center: s.center } })} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase' }} fontSize={fontSize + 2} data={titles.map(r => r.title)} />
            )
        return undefined;
    }, [titles, isShowHeader]);

    const _renderBody = React.useCallback(() => {
        if (filter)
            if (filter.length === 0)
                return <Text style={{ textAlign: 'center', width: screenWidth - 30 }}>Sin Eventos</Text>;
            else
                return (
                    filter.map((ev, idx) => <Row tamCol={titles.map(s => { return { size: s.size ?? 10, center: s.center } })} style={{ borderBottomColor: 'rgba(0,0,0,.3)', borderBottomWidth: .2 }} fontSize={fontSize} key={idx * .333} data={ev} />)
                )
        return <Text style={{ textAlign: 'center', width: screenWidth - 30 }}>Sin Eventos</Text>;
    }, [filter])

    return (
        <View style={[styles.container, colorBackgroundTable ? { backgroundColor: colorBackgroundTable } : {}]}>
            {_renderHeader()}
            <ScrollView horizontal={true}
                onScroll={({ nativeEvent }) => { scrollRefHeader?.current?.scrollTo({ x: nativeEvent.contentOffset.x, y: nativeEvent.contentOffset.y, animated: true }); }}
            >
                <View>
                    {_renderTH()}
                    <ScrollView >
                        {_renderBody()}
                    </ScrollView>
                </View>
            </ScrollView>
            {_renderPagination()}
        </View>
    )
}

const Table = (props: Props) => {
    return (
        <TableState>
            <RenderTable {...props} />
        </TableState>
    )
}

export default Table;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        ...stylesApp.shadow
    },
    textTitlesHeader: {
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
    containerPagination: {
        // height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    }
});