import React, { useCallback, useEffect, useState } from 'react';
import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';
import { FlatList, KeyboardTypeOptions, ListRenderItemInfo, NativeSyntheticEvent, ReturnKeyTypeOptions, StyleProp, StyleSheet, TextInput as NativeTextInput, TextInputFocusEventData, TextInputSubmitEditingEventData, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';
import { vh, vw } from '../config/Dimensions';
import _ from 'lodash';

interface Props<T> {
    formInputs: T;
    name: keyof T;
    control: Control<any, any>;
    isPassword?: boolean;
    label: string;
    placeholder: string;
    rules?: RegisterOptions;
    keyboardType?: KeyboardTypeOptions;
    returnKeyType?: ReturnKeyTypeOptions;
    onSubmitEditing?: ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void);
    refp?: React.RefObject<NativeTextInput>;
    mode?: "flat" | "outlined";
    dense?: boolean;
    disabled?: boolean;
    style?: StyleProp<TextStyle>
    onFocus?: (((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) & ((args: any) => void)) | undefined
    showSoftInputOnFocus?: boolean;
    renderRightIcon?: string;
    renderLefttIcon?: string;
}

export const Input = <T extends Object>({ renderRightIcon, renderLefttIcon, showSoftInputOnFocus, onFocus, isPassword, placeholder, control, name, label, rules, keyboardType, returnKeyType, onSubmitEditing, refp, mode, dense, disabled, style }: Props<T>) => {
    const [ShowPassword, setShowPassword] = useState<boolean>(false);
    const { colors } = useAppSelector(store => store.app.theme);

    const renderIcon = useCallback((error?: FieldError) => {
        return (
            <TextInput.Icon
                icon={renderLefttIcon ?? renderRightIcon ?? 'close'}
                color={(focused) => focused ? colors.outline : error ? colors.error : colors.primary}
            />
        )
    }, [renderLefttIcon, renderRightIcon, colors]);

    return (
        <Controller
            control={control}
            rules={{ ...rules }}
            name={String(name)}
            render={({ field: { value, onBlur, onChange }, fieldState: { error } }) => (
                <>
                    <TextInput
                        showSoftInputOnFocus={showSoftInputOnFocus}
                        ref={refp}
                        onFocus={onFocus}
                        blurOnSubmit={false}
                        onSubmitEditing={onSubmitEditing}
                        style={[style, { marginVertical: 3 }]}
                        disabled={disabled}
                        dense={dense}
                        mode={mode}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        label={label}
                        placeholder={placeholder}
                        secureTextEntry={isPassword && !ShowPassword}
                        error={error ? true : false}
                        keyboardType={keyboardType}
                        returnKeyType={returnKeyType}
                        left={renderLefttIcon ? renderIcon(error) : undefined}
                        right={renderRightIcon ? renderIcon(error) : isPassword && < TextInput.Icon
                            icon={ShowPassword ? 'eye' : 'eye-off'}
                            forceTextInputFocus={false}
                            color={(focused) => focused ? colors.outline : error ? colors.error : colors.primary}
                            onPress={() => setShowPassword(!ShowPassword)}
                            animated
                        />}
                    />
                    {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                </>
            )
            }
        />
    )
}