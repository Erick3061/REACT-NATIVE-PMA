import React from 'react';
import { Image, ScrollView } from 'react-native';
import { Button, Dialog, Portal, Text, } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { updateError, updateInfo, updateQuestion, updateTcyAp, updateThemeView } from '../features/alertSlice';
import { Ap } from './AP';
import { TC } from './TC';
import { Alert } from './Alert';
import { LightenDarkenColor } from '../functions/functions';
import { colors } from '../config/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { vw, vh } from '../config/Dimensions';

export const Alerts = () => {
    const { error, info, question, tcyap, theme } = useAppSelector((state) => state.alerts);
    const { colors: ThemeColors, dark } = useAppSelector((state) => state.app.theme);
    const dispatch = useAppDispatch();

    return (
        <Portal>
            {
                info.open &&
                <Alert
                    icon={info.icon}
                    type='info'
                    text={{
                        title: info.title ?? '',
                        subtitle: info.subtitle ?? '',
                        msg: info.msg ?? '',
                    }}
                    visible={info.open}
                    dispatch={() => dispatch(updateInfo({ ...info, open: false, msg: '' }))}
                />
            }
            {
                question.open &&
                <Alert
                    icon={question.icon}
                    type='question'
                    dismissable={question.dismissable}
                    text={{
                        title: question.title ?? '',
                        subtitle: question.subtitle ?? '',
                        msg: question.msg ?? '',
                    }}
                    visible={question.open}
                    dispatch={() => dispatch(updateQuestion({ ...question, open: false, msg: '' }))}
                />
            }
            {
                error.open &&
                <Alert
                    icon={error.icon}
                    type='error'
                    text={{
                        title: error.title ?? '',
                        subtitle: error.subtitle ?? '',
                        msg: error.msg ?? '',
                    }}
                    timeClose={error.timeClose}
                    visible={error.open}
                    dispatch={() => dispatch(updateError({ ...error, open: false, msg: '' }))}
                />
            }
            {
                theme &&
                <Alert
                    type='theme'
                    visible={theme}
                    dispatch={() => dispatch(updateThemeView(false))}
                />
            }
            {
                tcyap &&
                <Dialog style={{ backgroundColor: ThemeColors.background }} visible={tcyap.open} dismissable={tcyap.showTC ? tcyap.showTC.dismissable : true} onDismiss={() => dispatch(updateTcyAp({ ...tcyap, open: false }))}>
                    <Dialog.ScrollArea>
                        <ScrollView>
                            {
                                tcyap.showTC
                                    ?
                                    <Icon name='help' size={vw * 15} style={{ color: ThemeColors.primary, alignSelf: 'center', paddingVertical: vh * 1 }} />
                                    :
                                    <Image style={[{ height: 150, width: '100%', resizeMode: 'contain' }, dark ? { backgroundColor: ThemeColors.backdrop, borderRadius: 10, opacity: .8 } : {}]} source={require('../assets/logo2.png')} />
                            }
                            <Text variant='titleLarge' style={{ textTransform: 'uppercase', textAlign: 'center' }}>{tcyap.showTC ? '¿ Aceptas términos y condiciones ?' : 'términos y condiciones'}</Text>
                            <TC />
                            <Text variant='titleLarge' style={{ textTransform: 'uppercase', textAlign: 'center' }}>{tcyap.showTC ? '¿ Aceptas aviso de privacidad ?' : 'aviso de privacidad'}</Text>
                            <Ap />
                        </ScrollView>
                    </Dialog.ScrollArea>

                    <Dialog.Actions style={{ display: 'flex', justifyContent: 'center' }}>
                        {
                            tcyap.showTC
                                ?
                                <>
                                    <Button
                                        style={{ marginHorizontal: 5 }}
                                        contentStyle={{ backgroundColor: LightenDarkenColor(colors.Success, -20) }}
                                        labelStyle={{ textTransform: 'uppercase' }}
                                        mode='contained-tonal'
                                        onPress={() => dispatch(updateTcyAp({ ...tcyap, open: false, showTC: { confirm: true } }))}
                                    >Acepto</Button>
                                    <Button
                                        style={{ marginHorizontal: 5 }}
                                        contentStyle={{}}
                                        labelStyle={{ textTransform: 'uppercase' }}
                                        mode='contained-tonal'
                                        onPress={() => dispatch(updateTcyAp({ ...tcyap, open: false }))}
                                    >Cancelar</Button>
                                </>
                                :
                                <Button mode='contained-tonal' onPress={() => dispatch(updateTcyAp({ ...tcyap, open: false }))}>CERRAR</Button>
                        }
                    </Dialog.Actions>
                </Dialog>
            }

        </Portal>
    )
}