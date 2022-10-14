import React from 'react'
import { ActivityIndicator, Button, Dialog, Portal, Text } from 'react-native-paper'
import DialogActions from 'react-native-paper/lib/typescript/components/Dialog/DialogActions'
import { vw } from '../config/Dimensions'

export const Loading = () => {
    return (
        <Portal>
            <Dialog visible dismissable={false}>
                <Dialog.Content>
                    <ActivityIndicator animating size={vw * 10} />
                    <Text style={{ textAlign: 'center' }} variant='headlineSmall'>Cargando ...</Text>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}
