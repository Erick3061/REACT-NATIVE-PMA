import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import _ from 'lodash';
import { screenWidth } from '../config/Dimensions';
import { Text } from 'react-native-paper';

interface Props {
    data: Array<any>;
    label: string;
    height?: number;
    separator?: true;
    separatorColor?: string;
    multiselect?: true;
}
export const List = ({ data, label, height, separator, separatorColor }: Props) => {

    const [dataProvider, setDataProvider] = useState<DataProvider>(new DataProvider((r1, r2) => r1 !== r2));

    const containerList = useRef<View>(null);

    const _layoutProvider = useCallback(() => {
        return new LayoutProvider(
            index => index,
            (_, dim) => {
                dim.width = screenWidth;
                dim.height = height ?? 50;
            }
        );
    }, [dataProvider, height]);

    const _renderRow = useCallback((type: string | number, data: any, index: number, extendedState?: object | undefined) => {
        return (
            <>
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
                    <Text>{_.get(data, label)}</Text>
                </TouchableOpacity>
                {separator && <View style={{ borderTopWidth: .2, borderColor: separatorColor ?? 'silver' }}></View>}
            </>
        )
    }, [dataProvider, label, height, separator, separatorColor]);


    useEffect(() => {
        setDataProvider(dataProvider.cloneWithRows(data));
        console.log(data.length);
    }, [data]);

    return (
        <View style={{ flex: 1 }}>
            <View ref={containerList} style={{ flex: 1, marginVertical: 5, padding: 5, borderWidth: .2, borderRadius: 5, borderColor: separatorColor ?? 'silver', justifyContent: 'center' }}>
                {
                    data.length > 0
                        ?
                        <RecyclerListView
                            rowRenderer={_renderRow}
                            dataProvider={dataProvider}
                            layoutProvider={_layoutProvider()}
                        />
                        : <Text style={{ textAlign: 'center' }}>SIN COINCIDENCIAS</Text>
                }
            </View>
        </View>
    )
}
