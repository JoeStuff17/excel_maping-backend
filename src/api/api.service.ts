import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AnyAaaaRecord } from 'dns';
import { map } from 'rxjs';

@Injectable()
export class ApiService {
  url = "https://vmsmatrix.readyassist.net/api";
  constructor(
    private readonly http: HttpService
  ) { }
  token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjAsIm1vYmlsZU5vIjoiODgyNTY5Nzc1MCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NjYzOTY5NywiZXhwIjoxNjc2NzI2MDk3fQ.4LwNNVJOr2g55oEtXuDBQsSP2C5529SPv7e7z4mcvcE";

  async getMakes(name: any): Promise<AnyAaaaRecord> {
    // return this.http.get(this.url + '/vehicle/make');

    const data = await this.http
      .get(
        `https://vmsmatrix.readyassist.net/api/vehicle/make?name=${name}`
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    return data;
  }

  async getMasterId(makeid: any, model: any): Promise<AnyAaaaRecord> {
    // return this.http.get(this.url + '/vehicle/make');
    const data = await this.http
      .get(
        `https://vmsmatrix.readyassist.net/api/vehicle/master?make=${makeid}&model=${model}`, { headers: { Authorization: this.token } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    return data.data[0].id;
  }

  async getAmount(planId: any): Promise<AnyAaaaRecord> {
    // return this.http.get(this.url + '/vehicle/make');

    const data = await this.http
      .get(
        `https://vmsmatrix.readyassist.net/api/subscription/plans?id=${planId}`, { headers: { Authorization: this.token } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    return data.data[0].subscriptionPlan;
  }

  async getCxId(mobileNo: any): Promise<AnyAaaaRecord> {
    // return this.http.get(this.url + '/vehicle/make');   
    const data = await this.http
      .get(
        `https://vmsmatrix.readyassist.net/api/customers?mobileNo=${mobileNo}`, { headers: { Authorization: this.token } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    return data;
  }

  async createCx(body: any): Promise<any> {
    try {
      const data = await this.http
        .post(`https://vmsmatrix.readyassist.net/api/customers`, body)
        .pipe(map((resp) => resp.data))
        .toPromise()
        .catch((err) => {
          throw new HttpException(err.response.data, err.response.status);
        });        
      return data;
    }catch (error) {
      return "error";
    }
  }

  async createCxVehicle(body: any): Promise<any> {
    try {
      const data = await this.http
        .post(`https://vmsmatrix.readyassist.net/api/customer-vehicle-mapping/add-customer-vehicle`, body)
        .pipe(map((resp) => resp.data))
        .toPromise()
        .catch((err) => {
          throw new HttpException(err.response.data, err.response.status);
        });        
      return data.data;
    }catch (error) {
      return "error";
    }
  }

  async getRegVehicles(customerId: any): Promise<AnyAaaaRecord> {   
    const data = await this.http
      .get(
        `https://vmsmatrix.readyassist.net/api/customer-vehicle-mapping?customer=${customerId}&isActive=1`, { headers: { Authorization: this.token } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    return data.data;
  }

  async getRegVehicleId(registerdId: any, masterId: any): Promise<any> { 
    const data = await this.http
      .get(
        `https://vmsmatrix.readyassist.net/api/vehicle-registered/query?id=${registerdId}&vehicleMaster=${masterId}`, { headers: { Authorization: this.token } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    return data.data;
  }

  async createSubscrip(body: any): Promise<any> {
    try {
      const data = await this.http
        .post(`https://vmsmatrix.readyassist.net/api/subscription-order-book`, body)
        .pipe(map((resp) => resp.data))
        .toPromise()
        .catch((err) => {
          throw new HttpException(err.response.data, err.response.status);
        });        
      return data.data;
    }catch (error) {
      return "error";
    }
  }

  async createCustomerPurchase(body: any): Promise<any> {
    try {
      const data = await this.http
        .post(`https://vmsmatrix.readyassist.net/api/subscription-order-book/customer-purchase`, {...body, headers: { Authorization: this.token }}, )
        .pipe(map((resp) => resp.data))
        .toPromise()
        .catch((err) => {
          throw new HttpException(err.response.data, err.response.status);
        });        
      return data;
    }catch (error) {
      return "error";
    }
  }

}

