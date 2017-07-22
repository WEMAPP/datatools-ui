import jwt from 'jsonwebtoken'
import moment from 'moment'

import {checkLogin, receiveTokenAndProfile} from '../user'
import auth0 from '../../../common/user/Auth0Manager'

describe('manager > actions > user > ', () => {
  describe('checkLogin', () => {
    beforeEach(() => {
      // setup localStorage
      const storage = {}
      window.localStorage = {
        getItem: (k) => storage[k],
        setItem: (k, v) => { storage[k] = v }
      }

      // clear lock options
      auth0.lockOptions = undefined
    })

    it('should work with no token saved in localStorage', () => {
      expect(checkLogin()).toMatchSnapshot()
    })

    it('should work with expired token', (done) => {
      const expiredToken = jwt.sign({
        exp: moment().subtract(1, 'hours').unix()
      }, 'signingKey')

      window.localStorage.setItem('userToken', expiredToken)

      auth0.lockOptions = {
        getProfileSuccess: true,
        getProfileResult: {
          app_metadata: {
            datatools: []
          }
        }
      }

      const checkLoginResult = checkLogin()
      checkLoginResult[1]
        .then((result) => {
          delete result.payload.token
          expect(result).toMatchSnapshot()
          done()
        })
    })

    it('should work with unexpired token', (done) => {
      const validToken = jwt.sign({
        exp: moment().add(1, 'hours').unix()
      }, 'signingKey')

      window.localStorage.setItem('userToken', validToken)

      auth0.lockOptions = {
        getProfileSuccess: true,
        getProfileResult: {
          app_metadata: {
            datatools: []
          }
        }
      }

      const checkLoginResult = checkLogin()
      checkLoginResult[1]
        .then((result) => {
          expect(result.payload.token).toEqual(validToken)
          delete result.payload.token
          expect(result).toMatchSnapshot()
          done()
        })
    })
  })

  describe('receiveTokenAndProfile', () => {
    it('should receive token and profile', () => {
      expect(
        receiveTokenAndProfile({
          token: 'fake-token',
          profile: {
            app_metadata: {
              datatools: []
            }
          }
        })
      ).toMatchSnapshot()
    })
  })
})