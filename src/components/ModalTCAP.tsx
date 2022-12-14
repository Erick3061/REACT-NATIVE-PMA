import React, { useCallback } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import Color from 'color';
import { styles } from './Alert';
import { Button } from './Button';
import Text from './Text';

interface Props {
    accept?: {
        confirm: () => void;
        cancel: () => void;
        textConfirm: string;
        textCancel: string;
    }
    dismissable?: true;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalTCAP = ({ accept, visible, setVisible, dismissable }: Props) => {
    const { theme: { colors, roundness, fonts, dark } } = useAppSelector(state => state.app);
    const closeModal = () => {
        setVisible(false);
    }

    const _renderButtons = useCallback(() => {
        if (accept) {
            const { cancel, confirm, textCancel, textConfirm } = accept;
            return (
                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button
                        text={textCancel}
                        mode='contained'
                        customButtonColor={colors.error}
                        colorTextPressed={colors.background}
                        onPress={() => {
                            closeModal()
                            cancel()
                        }}
                    />
                    <Button
                        contentStyle={{ marginHorizontal: 5 }}
                        customButtonColor={colors.success}
                        text={textConfirm}
                        mode='text'
                        onPress={() => {
                            closeModal()
                            confirm()
                        }}
                    />
                </View>
            )
        }
        return (
            <View style={{ alignItems: 'flex-end', paddingTop: 10 }}>
                <Button text='cerrar' mode='contained' contentStyle={{ padding: 0 }} onPress={closeModal} />
            </View>
        )
    }, [accept, closeModal]);

    const TC = () => {
        return (
            <>
                <Text style={[style.text]}>
                    Es obligaci??n del usuario de la aplicaci??n, as?? como del titular respectivo, informar cambios en el personal que emplea la aplicaci??n, notificando altas y bajas de manera oportuna.
                </Text>
                <Text style={[style.text]}>
                    La informaci??n proporcionada por la aplicaci??n es de uso exclusivo para el usuario y PEMSA no es responsable del uso que dicho usuario haga de la informaci??n consultada.
                </Text>
                <Text style={[style.text]}>
                    El acceso a la informaci??n para consulta del cliente es independiente a la informaci??n resguardada
                    en los servidores de PEMSA, y la falta de acceso a la misma no exime de ninguna manera al cliente
                    del pago por el monitoreo de su sistema de alarma en adici??n a cualquier otro servicio contratado
                    u obligaciones adquiridas con PEMSA.
                </Text>
                <Text style={[style.text]}>
                    Para acceder a la aplicaci??n se requiere de un registro previo con el formato correspondiente por
                    parte del titular a el cual solicitar?? por conducto de su asesor comercial.
                </Text>
                <Text style={[style.text]}>
                    PEMSA se reserva el derecho de brindar o denegar autorizaci??n de usuarios y titulares para el uso
                    de su plataforma.
                </Text>
                <Text style={[style.text]}>La aplicaci??n puede ser sometida a actualizaciones sin previo aviso.</Text>
            </>
        )
    }
    const Ap = () => {
        return (
            <>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>Protecci??n Electr??nica Monterrey SA de CV</Text>, en lo sucesivo <Text style={[style.res]}>PEMSA</Text> en su car??cter de responsable encargado del tratamiento de sus datos personales, manifiesta que, para efectos del presente aviso, su domicilio se encuentra ubicado en la calle 33 Poniente 307, Colonia Chulavista, C.P. 72420; Puebla, Puebla, M??xico.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>PEMSA</Text> presenta este aviso de privacidad con la finalidad de dar cumplimiento a los art??culos 15, 16 y dem??s relativos de la Ley Federal de Protecci??n de Datos Personales en Posesi??n de los Particulares (LA LEY).
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>PEMSA</Text> se compromete a que estos datos ser??n tratados bajo las m??s estrictas medidas de seguridad que garanticen su confidencialidad.
                </Text>
                <Text style={[style.term]}>
                    Los referidos datos personales se incorporar??n a las distintas bases de datos de <Text style={[style.res]}>PEMSA</Text>, raz??n por la cual <Text style={[style.res]}>EL CLIENTE</Text> autoriza que <Text style={[style.res]}>PEMSA</Text> realice el tratamiento de sus datos personales de conformidad con las finalidades m??s adelante descritas, para utilizarlos durante el desarrollo de las operaciones y servicios contratados. <Text style={[style.res]}>PEMSA</Text> tendr?? la responsabilidad de protegerlos mientras est??n en su poder.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>1. Datos Personales Recibidos del Cliente</Text>
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>EL CLIENTE</Text> acepta de manera expresa entregar a <Text style={[style.res]}>PEMSA</Text> para su tratamiento, de manera enunciativa m??s no limitativa los siguientes datos personales:
                </Text>

                <Text style={[style.textAp]}>a) Datos generales del titular y/o personal autorizado: Apellido Paterno, Apellido Materno, Nombre(s), identificaci??n oficial, correo electr??nico, empresa donde labora y compa????a que representa.</Text>
                <Text style={[style.textAp]}>b) Domicilio: Calle, n??mero exterior, n??mero interior, colonia, c??digo postal, Estado, delegaci??n/municipio, tel??fono, correo electr??nico.</Text>

                <Text style={[style.term]}>
                    <Text style={[style.res]}>Datos Personales Sensibles.</Text> - Para cumplir con las finalidades previstas en este Aviso de Privacidad, <Text style={[style.res]}>PEMSA</Text> hace de su conocimiento que no se tratar??n datos personales sensibles:
                </Text>
                <Text style={[style.term]}>
                    En caso contrario se le dar??n los avisos respectivos para recabar debidamente su consentimiento expreso.
                </Text>
                <Text style={[style.term]}>
                    Estos datos ser??n tratados bajo las m??s estrictas medidas de seguridad que garanticen su confidencialidad.
                </Text>
                <Text style={[style.term]}>
                    Podr??n tratarse otros datos personales, sensibles y no sensibles, que no se incluyan en las listas anteriores siempre y cuando dichos datos se consideren de la misma naturaleza y no sean excesivos respecto a las finalidades para los cuales se recaban.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>2. Finalidad de los Datos Personales</Text>
                </Text>

                <Text style={[style.term]}>
                    <Text style={[style.res]}>El CLIENTE</Text> consiente que sus datos personales sean utilizados por <Text style={[style.res]}>PEMSA</Text> con la <Text style={[style.res]}>finalidad principal</Text> de:
                </Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>1.</Text> Identificaci??n, localizaci??n y contacto con el titular y encargados.</Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>2.</Text> Verificar y confirmar su identidad.</Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>3.</Text> Monitoreo de sus sistemas de alarmas.</Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>4.</Text> Consulta de los eventos recibidos en nuestra central de monitoreo.</Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>5.</Text> Atenci??n sus solicitudes, quejas, dudas y/o comentarios relacionados con nuestros servicios.</Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>6.</Text> Las dem??s finalidades que resulten necesarias para la prestaci??n de los servicios por usted requeridos.</Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>Finalidades Secundarias</Text>
                </Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>1.</Text> Realizar estudios y procesos internos.</Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>2.</Text> Realizar encuestas de calidad en el servicio y atenci??n a clientes.</Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>3.</Text> Para fines mercadot??cnicos, publicitarios o de prospecci??n comercial.</Text>
                <Text style={[style.textAp]}><Text style={[style.res]}>4.</Text> Cumplir con los requisitos legales y reglamentarios aplicables.</Text>
                <Text style={[style.term]}>
                    En caso de que no desee que sus datos personales sean tratados para estas finalidades secundarias, usted tiene un plazo m??ximo de 5 (cinco) d??as h??biles para comunicar lo anterior a la Direcci??n de Contacto: <Text style={[style.res]}>datospersonales@pem-sa.com</Text> La negativa para el uso de sus datos personales para estas finalidades secundarias, no podr?? ser un motivo para que le neguemos los servicios y productos que solicita o contrata con nosotros.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>3. Seguridad de los Datos Personales</Text>
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>PEMSA</Text> implementar?? las medidas de seguridad t??cnicas, administrativas y f??sicas necesarias para procurar la integridad de sus datos personales y evitar su da??o, p??rdida, alteraci??n, destrucci??n o el uso, acceso o tratamiento no autorizado.
                </Text>
                <Text style={[style.term]}>
                    ??nicamente el personal autorizado, que ha cumplido y observado los correspondientes requisitos de confidencialidad, podr?? participar en el tratamiento de sus datos personales. El personal autorizado tiene prohibido permitir el acceso de personas no autorizadas  y/o utilizar los  datos personales  para fines  distintos  a los  establecidos  en el  presente Aviso de Privacidad.  La obligaci??n de confidencialidad de las personas que participan en el tratamiento de sus datos personales subsiste a??n despu??s de terminada la relaci??n con <Text style={[style.res]}>PEMSA</Text>.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>4. Transferencias</Text>
                </Text>
                <Text style={[style.term]}>
                    Para efectos de este aviso de privacidad en la Aplicaci??n m??vil (APP) no se har??n transferencias de sus datos personales a terceros. En caso contrario se pondr??n a su disposici??n los documentos necesarios a fin de recabar su consentimiento expreso.
                </Text>
                <Text style={[style.term]}>
                    Se podr??n transmitir sus datos personales a las autoridades competentes, locales y federales cuando se encuentre dentro de las excepciones se??aladas en la Ley y su Reglamento. En el caso de transferencias, tratamiento de sus datos personales sensibles, financieros y bancarios, se requerir?? su consentimiento expreso, mediante la firma del aviso de privacidad respectivo.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>PEMSA</Text> podr?? transmitir libremente los datos personales de <Text style={[style.res]}>EL CLIENTE</Text> a las sociedades controladoras, subsidiarias o filiales, a una sociedad matriz o a cualquier sociedad de <Text style={[style.res]}>PEMSA </Text>que opere bajo los mismos procesos y pol??ticas internas.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>5. Limitaciones de la Divulgaci??n de Informaci??n</Text>
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>PEMSA</Text> se compromete a no transferir su informaci??n personal a terceros adicionales a los mencionados en el numeral anterior sin su consentimiento y en caso de que <Text style={[style.res]}>EL CLIENTE</Text> haya consentido que se realicen transferencias, <Text style={[style.res]}>PEMSA</Text> har?? del conocimiento del <Text style={[style.res]}>CLIENTE</Text> a trav??s de medios impresos o electr??nicos la finalidad por la que dicha informaci??n ser?? transferida a terceros; asimismo <Text style={[style.res]}>PEMSA</Text> informar?? a trav??s de los mismos medios por los que se recabaron los datos personales (domicilio f??sico y/o direcci??n de correo electr??nico) los cambios que se realicen al aviso de privacidad.

                </Text>
                <Text style={[style.term]}>
                    De igual forma <Text style={[style.res]}>EL CLIENTE</Text> se compromete a dar aviso a <Text style={[style.res]}>PEMS</Text>A sobre cualquier cambio respecto a su domicilio f??sico y/o direcci??n de correo electr??nico, o personas autorizadas a usar la APP con la finalidad de que <Text style={[style.res]}>PEMSA</Text> pueda comunicarse con <Text style={[style.res]}>EL CLIENTE</Text> para informar cualquier cambio o modificaci??n respecto de lo contenido en el presente aviso de privacidad.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>PEMSA</Text> no necesitar?? el consentimiento de <Text style={[style.res]}>EL CLIENTE</Text> para transferir a terceras personas su informaci??n en los siguientes casos:
                </Text>
                <Text style={[style.textAp]}>a) Cuando la transferencia est?? prevista en una Ley o Tratado en los que M??xico sea parte.</Text>
                <Text style={[style.textAp]}>b) Cuando la transferencia sea necesaria para la prevenci??n o el diagn??stico m??dico, la prestaci??n de asistencia sanitaria, tratamiento m??dico o la gesti??n de servicios sanitarios.</Text>
                <Text style={[style.textAp]}>c) Cuando sea requerida por autoridades competentes de conformidad con las disposiciones legales aplicables.</Text>

                <Text style={[style.term]}>
                    <Text style={[style.res]}>6.  Medios para ejercer los derechos de acceso, rectificaci??n, cancelaci??n y oposici??n (ARCO) de los datos personales</Text>
                </Text>

                <Text style={[style.term]}>
                    <Text style={[style.res]}>PEMSA</Text> ha designado a un encargado de datos personales, (el ???oficial de Privacidad???), por lo tanto, usted podr?? limitar el uso o divulgaci??n de sus datos personales mediante comunicaci??n dirigida al Oficial de Privacidad al correo electr??nico siguiente:<Text style={[style.res]}>datospersonales@pem-sa.com</Text> (la ???Direcci??n de Contacto???).
                </Text>
                <Text style={[style.term]}>
                    Usted tiene derecho de: (i) acceder a sus datos personales en nuestro poder y conocer los detalles del tratamiento de los mismos, (ii) rectificarlos en caso de ser inexactos o incompletos, (iii) cancelarlos cuando considere que no se requieren para alguna de las finalidades se??aladas en el presente Aviso de Privacidad, est??n siendo utilizados para finalidades no consentidas o haya finalizado la relaci??n contractual o de servicio, o (iv) oponerse al tratamiento de los mismos para fines espec??ficos, seg??n lo diga la ley, (conjuntamente, los ???Derechos ARCO???).
                </Text>
                <Text style={[style.term]}>
                    Los Derechos ARCO se ejercer??n mediante la presentaci??n de la solicitud respectiva, la cual deber?? ser solicitada al Oficial de privacidad al correo: <Text style={[style.res]}>datospersonales@pem-sa.com</Text> acompa??ada de la siguiente informaci??n y documentaci??n:
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>I. </Text>Su nombre, domicilio y correo electr??nico para poder comunicarle la respuesta a la Solicitud ARCO;
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>II. </Text>Los documentos que acrediten su identidad (copia de IFE, pasaporte o cualquier otra identificaci??n oficial) o en su caso, los documentos que acrediten su representaci??n legal;
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>III. </Text>Una descripci??n clara y precisa de los datos personales respecto de los cuales busca ejercer alguno de los Derechos ARCO;
                    IV.Cualquier documento o informaci??n que facilite la localizaci??n de sus datos personales;
                    V.En caso de solicitar una rectificaci??n de datos, deber?? de indicar tambi??n, las modificaciones a realizarse y aportar la documentaci??n que sustente su petici??n; y
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>VI. </Text>La indicaci??n del lugar donde podremos revisar los originales de la documentaci??n que acompa??e.
                </Text>
                <Text style={[style.term]}>
                    Su Solicitud ARCO ser?? contestada mediante un correo electr??nico por parte del Oficial de Privacidad en un plazo m??ximo de 20 (veinte) d??as h??biles contados desde el d??a en que se haya recibido su Solicitud ARCO. En caso de que la Solicitud ARCO se conteste de manera afirmativa o procedente, tales cambios se har??n en un plazo m??ximo de 15 (quince) d??as h??biles. Los plazos referidos en este p??rrafo se podr??n prorrogar por una vez por un periodo igual en caso de ser necesario.
                </Text>
                <Text style={[style.term]}>
                    Es importante comunicarle que <Text style={[style.res]}>PEMSA</Text> podr?? negar el acceso (la ???Negativa???) para que usted ejerza sus derechos ARCO en los siguientes supuestos:
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>I. </Text>Cuando Usted no sea el titular de los datos personales, o su representante legal no est?? debidamente acreditado para ejercer por medio de ??l, sus Derechos ARCO;
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>II. </Text>Cuando en nuestra base de datos no se encuentren sus datos personales;
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>III. </Text>Cuando se lesionen los derechos de un tercero;
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>IV. </Text>Cuando exista un impedimento legal o la resoluci??n de una autoridad competente, que restrinja sus Derechos ARCO; y
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>V. </Text>Cuando la Rectificaci??n, Cancelaci??n u Oposici??n haya sido previamente realizada.
                </Text>
                <Text style={[style.term]}>
                    En relaci??n con lo anterior, la Negativa podr?? ser parcial, en cuyo caso <Text style={[style.res]}>PEMSA</Text> efectuar?? el acceso, rectificaci??n, cancelaci??n u oposici??n en la parte procedente.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>PEMSA</Text> siempre le informar?? el motivo de su decisi??n y se la comunicar?? a Usted o en su caso, a su representante legal, en los plazos anteriormente establecidos, por correo electr??nico, acompa??ando, en su caso, las pruebas que resulten pertinentes.
                </Text>
                <Text style={[style.term]}>
                    El ejercicio de los Derechos ARCO ser?? gratuito, previa acreditaci??n de su identidad ante el responsable, pero si Usted reitera su solicitud en un periodo menor a doce meses, los costos ser??n de tres d??as de la Unidad de Medida y Actualizaci??n Vigente, m??s I.V.A., a menos que existan modificaciones sustanciales al Aviso de Privacidad que motiven nuevas consultas. En todos los casos, la entrega de los datos personales ser?? gratuita, con la excepci??n de que Usted deber?? de cubrir los gastos justificados de env??o o el costo de reproducci??n en copias u otros formatos.
                </Text>
                <Text style={[style.term]}>
                    <Text style={[style.res]}>EL CLIENTE</Text> podr?? revocar el consentimiento que ha otorgado a PEMSA para el tratamiento de los datos personales que no sean indispensables para el cumplimiento de las obligaciones derivadas del v??nculo jur??dico que les une, a fin de que <Text style={[style.res]}>PEMSA</Text> deje de hacer uso de los mismos. Para ello, es necesario que <Text style={[style.res]}>EL CLIENTE</Text> presente su petici??n en los t??rminos antes mencionados.
                </Text>

                <Text style={[style.term]}>
                    <Text style={[style.res]}>7. Mecanismo para revocaci??n del consentimiento.</Text>
                </Text>
                <Text style={[style.term]}>
                    En caso de que Usted decida revocar su consentimiento para que <Text style={[style.res]}>PEMSA</Text> deje de llevar a cabo el tratamiento de sus datos personales, o se oponga a la transferencia de los mismos, deber?? de enviar una solicitud de revocaci??n de consentimiento a la Direcci??n de Contacto, y deber?? de ser acompa??ada en el correo electr??nico de los documentos que acrediten su identidad (copia de IFE, pasaporte o cualquier otra identificaci??n oficial) o en su caso, los documentos que acrediten su representaci??n legal y la indicaci??n del lugar en el cual se pone a nuestra disposici??n los documentos originales.
                </Text>
                <Text style={[style.term]}>
                    Para conocer el procedimiento y requisitos para la revocaci??n del consentimiento, usted podr?? ponerse en contacto con nuestro Oficial de Privacidad en el correo electr??nico siguiente: <Text style={[style.res]}>datospersonales@pem-sa.com</Text>
                </Text>
                <Text style={[style.term]}>
                    De conformidad con lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 relativo a la protecci??n de las personas f??sicas en lo que respecta al tratamiento de datos personales y a la libre circulaci??n de estos datos (en adelante ???Reglamento general de protecci??n de datos??? o ???GDPR???), <Text style={[style.res]}>PEMSA</Text> se compromete a seguir obteniendo su consentimiento expreso para adquirir, procesar y tratar sus datos personales de conformidad con lo establecido en el GDPR.
                </Text>
                <Text style={[style.term]}>
                    El presente Aviso de Privacidad y sus cambios ser?? publicado en las oficinas de <Text style={[style.res]}>PEMSA</Text> y/o en la p??gina electr??nica siguiente: <Text style={[style.res]}>www.pem-sa.com</Text>
                </Text>
            </>
        )
    }

    return (
        <Modal visible={visible} animationType='fade' hardwareAccelerated transparent supportedOrientations={['landscape', 'portrait']}>
            <StatusBar backgroundColor={colors.backdrop} />
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Pressable style={{ width: '100%', height: '100%', backgroundColor: Color(colors.backdrop).fade(.7).toString() }} onPress={() => !dismissable && setVisible(false)} />
                <View style={[styles.modal, { backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background, borderRadius: roundness * 3, maxWidth: '95%', height: '90%' }]}>
                    <View style={{ justifyContent: 'center', flex: 1 }}>
                        <View>
                            <ScrollView>
                                <Text variant='titleLarge' style={[style.title]}>{accept ? '?? Aceptas t??rminos y condiciones ?' : 't??rminos y condiciones'}</Text>
                                <TC />
                                <Text variant='titleLarge' style={[style.title]}>{accept ? '?? Aceptas aviso de privacidad ?' : 'aviso de privacidad'}</Text>
                                <Ap />
                            </ScrollView>
                        </View>
                    </View>
                    {_renderButtons()}
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const style = StyleSheet.create({
    title: {
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    text: {
        textAlign: 'justify',
        marginVertical: 3
    },
    res: {
        fontWeight: 'bold'
    },
    term: {
        textAlign: 'justify',
        marginVertical: 3
    },
    textAp: {
        textAlign: 'justify',
    }
});