// utils/br-docs.js

export const STATE_LIST = [
  { name: "Acre", uf: "AC" },
  { name: "Alagoas", uf: "AL" },
  { name: "Amapá", uf: "AP" },
  { name: "Amazonas", uf: "AM" },
  { name: "Bahia", uf: "BA" },
  { name: "Ceará", uf: "CE" },
  { name: "Distrito Federal", uf: "DF" },
  { name: "Espírito Santo", uf: "ES" },
  { name: "Goiás", uf: "GO" },
  { name: "Maranhão", uf: "MA" },
  { name: "Mato Grosso", uf: "MT" },
  { name: "Mato Grosso do Sul", uf: "MS" },
  { name: "Minas Gerais", uf: "MG" },
  { name: "Pará", uf: "PA" },
  { name: "Paraíba", uf: "PB" },
  { name: "Paraná", uf: "PR" },
  { name: "Pernambuco", uf: "PE" },
  { name: "Piauí", uf: "PI" },
  { name: "Rio de Janeiro", uf: "RJ" },
  { name: "Rio Grande do Norte", uf: "RN" },
  { name: "Rio Grande do Sul", uf: "RS" },
  { name: "Rondônia", uf: "RO" },
  { name: "Roraima", uf: "RR" },
  { name: "Santa Catarina", uf: "SC" },
  { name: "São Paulo", uf: "SP" },
  { name: "Sergipe", uf: "SE" },
  { name: "Tocantins", uf: "TO" },
];

export function isValidCPF(input) {
  const cpf = input.replace(/\D+/g, "");
  // Invalid if not exactly 11 digits or if all digits are the same (e.g., "11111111111")
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  // Helper function to calculate the validations digits (10th & 11th) of the CPF
  const calcCheckDigit = (cpf, length) => {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += parseInt(cpf[i]) * (length + 1 - i);
    let result = 11 - (sum % 11);
    return result > 9 ? 0 : result;
  };

  const firstDigit = calcCheckDigit(cpf, 9); // Calculate the first validation digit (10th digit) using the first 9 digits
  const secondDigit = calcCheckDigit(cpf, 10); // Calculate the second validation digit (11th digit) using the first 10 digits

  // Check if both calculated digits match the input CPF digits
  return firstDigit === parseInt(cpf[9]) && secondDigit === parseInt(cpf[10]);
}

export function isValidCNPJ(input) {
  const cnpj = input.replace(/\D+/g, "");
  // Invalid if not exactly 14 digits or if all digits are the same (e.g., "11111111111111")
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  // Helper function to calculate the validations digits (13th & 14th) of the CNPJ
  const calcCheckDigit = (length) => {
    let sum = 0;
    let weight = length - 7;
    for (let i = 0; i < length; i++) {
      sum += parseInt(cnpj[i]) * weight--;
      if (weight < 2) weight = 9;
    }
    let result = sum % 11;
    return result < 2 ? 0 : 11 - result;
  };

  const firstDigit = calcCheckDigit(12); // Calculate the first validation digit (13th digit) using the first 12 digits
  const secondDigit = calcCheckDigit(13); // Calculate the second validation digit (14th digit) using the first 13 digits

  // Check if both calculated digits match the input CNPJ digits
  return (
    firstDigit === parseInt(cnpj[12]) && secondDigit === parseInt(cnpj[13])
  );
}

export const fetchViaCep = async (cep) => {
  const address = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const { uf, localidade, bairro, logradouro, complemento } =
    await address.json();

  return {
    state: uf,
    city: localidade,
    district: bairro, // maybe change it to neighborhood
    street: logradouro,
    complement: complemento,
  };
};
