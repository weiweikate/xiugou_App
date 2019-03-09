import { NativeModules } from "react-native";

const { PhoneAuthenModule } = NativeModules;

const isCanPhoneAuthen = () => {
    return PhoneAuthenModule.isCanPhoneAuthen();
};

const startPhoneAuthen = (phoneNum) => {
    // accessCode = "eyAgImsiIDogIk0xOTJYT3lYR0Y1QWdRTWhuMitucENrYmxjZDFPemxRemxzUWdESTRjYjlOWE5Pc1k1NVNRcHpJTmFLZ2F0eCtTTkYydGx0NWVqNE5cL1wvNGhDWDFWcWg3ZnNhUGQrRG9JMDlBN2htdmR4MmVONVJWaE4wb0F6K3VpcFRqVW9TVWVjRFlFTzVXbzhNOXE0eWFUWHZJUktEbUt4VERqUzcwalNBWDhpOHN3NUZETXVxWFlWSFN6MVZ3NW9jdlZKMkJzV1VZMkN1SHZDNTZEazRIRXpMZkpzcFh2d0E4TTZKNEpETUR4THh3dWprVzZBbkw5SjJRMTJEUDFuVmZcL2VzYkJ6MGhpOXp3Q1BUMFAxQjkyRmJlTFEreElyZmdUNkJvZ1FDeVpTbFpzZmJHb2VLU3Q0d2pKOEFwR3FpVncwc3kwQllEM1NiRVVVMUt6ckQ3eDhzOWJ5dz09IiwgICJ1IiA6ICIiLCAgImMiIDogIldiYmlHaUErcU5CeFFVbHVvdDczUTlUN0FwR1FBODZ1OWQySUhWb2JPbkx6d290eUVBUVlUaVExNUljS3FDUHhGaEFXRzJaR0h0T0ZiS1wvVktoalF3ZjU0OUZRdXAzQWNZczg3Z3h6cVlBdUJFc1NGeGYzNm1CdzhGeVhMT1lVU0MrR3Z5b3pZeGQ2U3ZJQWdzTEpHWVdFdGkydVdHaitXUzIxVUVWeVh1R1dsQ1R3QTc5Mk1Sdnp3RHdGV1lIaG00RzB5Q0d1UkZ5b0dJNEFzejcwdDljM0NKUENoUkxnWEw2WXV4YWN6UjhtZmxJQ00yaUVRTmh1U1JDbllOUDJZYm1TZFlLRXdncW5ZOGIzZWU4akJTS2J6VGh1VGF1b3pjbURncHZlS0JBXC9DZ3I3a05BZFdsSzFQK2p0Yk1mVHlGRk9sdHRKUVEwd3NqdHh6VjJrbHFzc3paUXh1S2N0NlwvM0M3cUFrdlppRE5GaFJOSmtBYzh3SVVTaWZ6amQ5eGNGVElLQVYrSityMHZMZmZvQlI0SDc2MVRpM285TG03eFdNOUd3d3c4eldzV1FqVlVsMVNYVGVcL1hJSllkUXlWelhxa2RQeVBuZDJEOWNYOWJkQ1wvNHBxZDZLZEZBcjRFcmdYWjZEZ2IrR0E9IiwgICJvIiA6ICJpT1MifQ==";
    // msg = "";
    // resultCode = 6666; 666代表成功
    return PhoneAuthenModule.startPhoneAuthenWithPhoneNum(phoneNum);
};

export { isCanPhoneAuthen, startPhoneAuthen };