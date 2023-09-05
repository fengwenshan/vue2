import _ from 'lodash-es';
import json from './index.json';
const a = '12312312';

class A {
  a: string;
  constructor() {
    this.a = '123123';
  }
}
const fn = () => {
  return '1';
};
console.log(a, new A().a, fn(), json, _ );