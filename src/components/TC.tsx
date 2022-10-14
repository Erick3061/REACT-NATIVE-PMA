import React from 'react'
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper'

export const TC = () => {
    return (
        <>
            <Text style={styles.text}>
                Es obligación del usuario de la aplicación, así como del titular respectivo, informar cambios en el personal que emplea la aplicación, notificando altas y bajas de manera oportuna.
            </Text>
            <Text style={styles.text}>
                La información proporcionada por la aplicación es de uso exclusivo para el usuario y PEMSA no es
                responsable del uso que dicho usuario haga de la información consultada.
            </Text>
            <Text style={styles.text}>
                El acceso a la información para consulta del cliente es independiente a la información resguardada
                en los servidores de PEMSA, y la falta de acceso a la misma no exime de ninguna manera al cliente
                del pago por el monitoreo de su sistema de alarma en adición a cualquier otro servicio contratado
                u obligaciones adquiridas con PEMSA.
            </Text>
            <Text style={styles.text}>
                Para acceder a la aplicación se requiere de un registro previo con el formato correspondiente por
                parte del titular a el cual solicitará por conducto de su asesor comercial.
            </Text>
            <Text style={styles.text}>
                PEMSA se reserva el derecho de brindar o denegar autorización de usuarios y titulares para el uso
                de su plataforma.
            </Text>
            <Text style={styles.text}>La aplicación puede ser sometida a actualizaciones sin previo aviso.</Text>
        </>
    )
}
const styles = StyleSheet.create({
    text: {
        textAlign: 'justify',
        marginVertical: 3
    },
});
