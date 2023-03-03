import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AnyAaaaRecord } from 'dns';
import { map } from 'rxjs';

@Injectable()
export class ApiService {
  url = "https://vmsmatrix.readyassist.net/api/"; //dev
  constructor(
    private readonly http: HttpService
  ) { }
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjAsIm1vYmlsZU5vIjoiODgyNTY5Nzc1MCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NzgyMjAxNiwiZXhwIjoxNjc3OTA4NDE2fQ.BlMcjNpNc78O1essNfpdqSZoQYF1_Ys3TUDXW51sayg";

  //Fetching makeId
  async getMake(name: any): Promise<AnyAaaaRecord> {
    const data = await this.http
      .get(
        this.url + `vehicle/make?name=${name}`
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });

    const check = data.length > 0 ? data[0] : undefined;
    return check;
  }

  //Fetching masterId
  async getMasterId(makeid: any, model: any): Promise<AnyAaaaRecord> {
    const data = await this.http
      .get(
        this.url + `vehicle/master?make=${makeid}&model=${model}`, { headers: { Authorization: `Bearer ${this.token}` } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    const check = data.data.length > 0 ? data.data : undefined;
    return check;
  }

  //Fetching amount
  async getAmount(planId: any): Promise<AnyAaaaRecord> {
    const data = await this.http
      .get(
        this.url + `subscription/plans/detail-by-id?id=${planId}`, { headers: { Authorization: `Bearer ${this.token}` } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    const check = data.data != null ? data.data : undefined;
    return check;
  }

  //Fetching customerId
  async getCxId(mobileNo: any): Promise<AnyAaaaRecord> {
    const data = await this.http
      .get(
        this.url + `customers?mobileNo=${mobileNo}`, { headers: { Authorization: `Bearer ${this.token}` } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    const check = data.length > 0 ? data[0] : undefined;
    return check;
  }

  //Creating customer
  async createCx(Customer_Name, Customer_MobileNo, clientIds): Promise<any> {
    const body = {
      "name": Customer_Name, "mobileNo": Customer_MobileNo, "clientIds": [clientIds]
    }
    try {
      const data = await this.http
        .post(this.url + `customers`, body)
        .pipe(map((resp) => resp.data))
        .toPromise()
        .catch((err) => {
          throw new HttpException(err.response.data, err.response.status);
        });
      return data;
    } catch (error) {
      return "error";
    }
  }

  //Checking Vehicle number exist or not
  async getRegVehicleCheck(registeNo: any): Promise<any> {
    const data = await this.http
      .get(
        this.url + `vehicle-registered/query?registrationNumber=${registeNo}&isConfirmed=1`, { headers: { Authorization: `Bearer ${this.token}` } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    const check = data.data.length > 0 ? false : true;
    return check;
  }

  //Fetching Registerd Vehicle Id
  async getRegVehicles(registerNo: any, masterId: any ): Promise<AnyAaaaRecord> {
    const data = await this.http
      .get(
        this.url + `vehicle-registered/query?registrationNumber=${registerNo}&vehicleMaster=${masterId}`, { headers: { Authorization: `Bearer ${this.token}` } }
      )
      .pipe(map((resp) => resp.data))
      .toPromise()
      .catch((err) => {
        throw new HttpException(err.response.data, err.response.status);
      });
    const chk = data.data.length > 0 ? data : false;
    return chk;
  }

  //Creating vehicle
  async createCxVehicle(customerId, clientIds, Vehicle_Register_No, masterId): Promise<any> {
    const body = {
      "customerId": customerId, "regNo": Vehicle_Register_No, "clientId": [clientIds], "vehicleMasterId": masterId
    }
    try {
      const data = await this.http
        .post(this.url + `customer-vehicle-mapping/add-customer-vehicle`, { ...body, headers: { Authorization: `Bearer ${this.token}` } })
        .pipe(map((resp) => resp.data))
        .toPromise()
        .catch((err) => {
          throw new HttpException(err.response.data, err.response.status);
        });
        console.log("creating vehicle",data);
        
      return data.data;
    } catch (error) {
      return "error";
    }
  }

  //creating subscription
  async createSubscrip(body: any): Promise<any> {
    try {
      const data = await this.http
        .post(`${this.url}subscription-order-book/client-purchase`, { ...body }, { headers: { Authorization: `Bearer ${this.token}` } })
        .pipe(map((resp) => resp.data))
        .toPromise()
        .catch((err) => {
          throw new HttpException(err.response.data, err.response.status);
        });
      return data;
    } catch (error) {
      return "error";
    }
  }

}

