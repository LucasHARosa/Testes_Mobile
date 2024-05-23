// import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native'
// import React from 'react'
// import { ImageGet } from './src/components/ImageGet';

// export default function index() {

//   return (
//     <View style={styles.container}> 
//     <KeyboardAvoidingView>

//       <ImageGet  />
//       <TextInput placeholder='aqui texto'>
        
//       </TextInput>
//     </KeyboardAvoidingView>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     height: "100%",
//     padding: 20,
//     marginTop: 60,
//     backgroundColor: '#fff',
//   },
// });

import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [enderecoBase, setEnderecoBase] = useState('Avenida Paulista, 1578, São Paulo, SP');
  const [enderecoColetaEntrega, setEnderecoColetaEntrega] = useState('Rua das Flores, 199, Curitiba, PR');
  const [valorFixo, setValorFixo] = useState('180.00');
  const [valorCustoKm, setValorCustoKm] = useState('3.00');
  const [valorKmBase, setValorKmBase] = useState('20.00');
  const [resultado, setResultado] = useState('');
  const [distancia, setDistancia] = useState('');


  const calcularColetaEntrega = async () => {
    const apiKey = 'AIzaSyD-lOTxZ25VmmSCL1TJrhkA3LE7zonBKB4';
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(enderecoBase)}&destinations=${encodeURIComponent(enderecoColetaEntrega)}&key=${apiKey}`;
    
    try {
      const response = await axios.get(url);
      const data = response.data;
      //console.log(data.rows[0].elements[0]);
      
      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        const distancia = data.rows[0].elements[0].distance.value / 1000; // distância em km
        let valorTotal = parseFloat(valorFixo);

        if (distancia > parseFloat(valorKmBase)) {
          const kmExcedido = distancia - parseFloat(valorKmBase);
          valorTotal += kmExcedido * parseFloat(valorCustoKm);
        }

        setResultado(`Valor Total: R$ ${valorTotal.toFixed(2)}`);
        setDistancia(`Distância: ${distancia.toFixed(2)} km`);
      } else {
        Alert.alert('Erro', 'Erro ao calcular a distância.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Erro na requisição.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora de Coleta/Entrega</Text>
      <Text style={styles.label}>Endereço da Base:</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={'#777'}
        placeholder="Endereço da Base"
        value={enderecoBase}
        onChangeText={setEnderecoBase}
      />
      <Text style={styles.label}>Endereço da Coleta/Entrega:</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={'#777'}
        placeholder="Endereço da Coleta/Entrega"
        value={enderecoColetaEntrega}
        onChangeText={setEnderecoColetaEntrega}
      />
      <Text style={styles.label}>Valor Fixo (R$):</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={'#777'}
        placeholder="Valor Fixo (R$)"
        value={valorFixo}
        onChangeText={setValorFixo}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Valor de Custo por Km Excedente (R$):</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={'#777'}
        placeholder="Valor de Custo por Km Excedente (R$)"
        value={valorCustoKm}
        onChangeText={setValorCustoKm}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Valor de Km Base (Km):</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={'#777'}
        placeholder="Valor de Km Base (Km)"
        value={valorKmBase}
        onChangeText={setValorKmBase}
        keyboardType="numeric"
      />
      <Button title="Calcular" onPress={calcularColetaEntrega} />
      {resultado ? (
        <>
          <Text style={styles.resultado}>{resultado}</Text> 
          <Text style={styles.resultado}>{distancia}</Text>
        </>
      ): null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#333',
  },
  resultado: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
})

