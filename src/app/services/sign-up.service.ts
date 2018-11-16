import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Request, RequestMethod, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class SignUpService {
  private signUpSuccess: any;
  private service_api_end_point: string;
  @Output() getRegisteredStatus: EventEmitter<boolean> = new EventEmitter();
  @Output() verificationResponse: EventEmitter<any> = new EventEmitter();

  constructor(private http: Http) {
    this.signUpSuccess = true;
    this.service_api_end_point = environment.apiUrl;
  }

  signup(username: string, email: string, password: string) {
    let headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });

    var userObject = JSON.stringify({username: username, password: password, email: email});

    return this.http.post(this.service_api_end_point +'users/', userObject, options)
        .pipe(map((response: Response) => {
          if (String(response.status) == "201")
            {
              console.log('users/ POST response is 201:')
              console.log(response);
              this.getRegisteredStatus.emit(true);
              //let user = response.json();
              //console.log("sign up token is " + user.token);
              let newUser = true;
              localStorage.setItem('newUser', String(newUser))
              localStorage.setItem('email', email);
              return true;
            }
          else {
              console.log('users/ POST response is not 201:')
              console.log(response);
              this.getRegisteredStatus.emit(false);
              return false;
          }
        }));
  }

  activate(token: string) {
    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({
      headers: headers
    });

    const tokenObject = JSON.stringify({'token': token});

    return this.http.post(this.service_api_end_point + 'verification/activate/', tokenObject, options)
        .subscribe(
          (response: Response) => {
              console.log(response);
              const res = response.json();
            if (response.status === 200) {
              console.log(
                  'verfication/activate 200 response status: ' +
                  response.status +
                  'json: ' +
                  JSON.stringify(res));
              this.verificationResponse.emit(res);
              return true;
            } else {
              console.log('verfication/activate non-200 response status ' + response.status);
              this.verificationResponse.emit(res);
              return true;
            }
          },
          err => {
              console.log('error in verification/activate/:' + err);
              this.verificationResponse.emit(JSON.parse(err._body));
              return false;
          });
  }

  signupSuccess() {
    return this.signUpSuccess;
  }

  private handleError(error: Response) {
    //this.signUpSuccess = false;
    console.error("error:");
    console.error(error)
    console.error("end of error");
    //return Observable.throw(error.json().error || 'Server error');
  }

}
