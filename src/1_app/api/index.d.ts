/**
 *
 * AxiosRequestConfig is used to process various configurations of Axios HTTP requests.
 * Is a conditional type that checks whether additional parameters (Params) are defined. If the parameters are not defined, the standard 'config' is taken.
 * Otherwise, the 'params' and 'config' properties are defined.
 *
 * source: https://github.com/siberiacancode
 */

export type AxiosRequestConfig<Params = undefined> = Params extends undefined
  ? { config?: import('axios').AxiosRequestConfig }
  : { params: Params; config?: import('axios').AxiosRequestConfig };