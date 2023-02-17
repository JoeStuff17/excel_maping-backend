import { ApiService } from './../api/api.service';
import { FailedRecordService } from './../failed-record/failed-record.service';
import { SuccessRecordEntity } from './entity/success-record.entity';
import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordBatchService } from 'src/record-batch/record-batch.service';

var xml = require('fs');

@Injectable()
export class SuccessRecordService {
  constructor(
    @InjectRepository(SuccessRecordEntity) private readonly succcessRepo: Repository<SuccessRecordEntity>,
    private readonly failedRecordService: FailedRecordService,
    private readonly batchService: RecordBatchService,
    private readonly api: ApiService
  ) { }
  makeId: [];
  masterId: [];
  amount: [];
  customerId: [];
  registerVehicleId: [];
  subCreatedId: any;

  async creates(payload) {
    // let s = 0;
    const fc = [];
    let sc = 0;
    let clientIds: any;
    const purpose = 'subscription';
    const batch: any = await this.batchService.create({
      totalCount: payload.length,
      // purpose: purpose,
      // successCount: su,
      // failedCount: arr.length
    });

    // clientIds = payload.Client_Id[0];
    clientIds = 1;


    for (let i = 0; i < payload.Customer_Name.length; i++) {
      // payload.batch = batch.id;

      if (payload.Customer_Name[i] == null ||
        payload.Customer_MobileNo[i] == null || payload.Vehicle_Brand[i] == null ||
        payload.Vehicle_Model[i] == null || payload.Seller_Id[i] == null || payload.lat[i] == null
        || payload.lng[i] == null || payload.Plan_Purchased_Date[i] == null || payload.Plan_Id[i] == null) {
        fc.push({
          Client_Id: clientIds,
          Customer_Name: payload.Customer_Name[i],
          Customer_MobileNo: payload.Customer_MobileNo[i],
          Vehicle_Brand: payload.Vehicle_Brand[i],
          Vehicle_Model: payload.Vehicle_Model[i],
          Vehicle_Register_No: payload.Vehicle_Register_No[i],
          Seller_Id: payload.Seller_Id[i],
          lat: payload.lat[i],
          lng: payload.lng[i],
          Plan_Purchased_Date: payload.Plan_Purchased_Date[i],
          Plan_Id: payload.Plan_Id[i],
          batch: batch.id
        });
        await this.failedRecordService.createFailRec(fc);


      } else {
        // payload.batch = Array(payload.Client_Id.length).fill(batch.id);
        const successdata = await this.succcessRepo.create({
          Client_Id: clientIds,
          Customer_Name: payload.Customer_Name[i],
          Customer_MobileNo: payload.Customer_MobileNo[i],
          Vehicle_Brand: payload.Vehicle_Brand[i],
          Vehicle_Model: payload.Vehicle_Model[i],
          Vehicle_Register_No: payload.Vehicle_Register_No[i],
          Seller_Id: payload.Seller_Id[i],
          lat: payload.lat[i],
          lng: payload.lng[i],
          Plan_Purchased_Date: payload.Plan_Purchased_Date[i],
          Plan_Id: payload.Plan_Id[i],
          batch: batch.id
        });
        const sd = await this.succcessRepo.save(successdata);
        sc += 1;
      }

      //<--------- Failed Entry in .txt file -------->
      // let cs = await xml.createWriteStream('./xml/sample.txt');
      // let a = 0;
      // for (let i = 0; i < arr.length; i++) {
      //     cs.write("Id:" + arr[i].Client_Id + "\t\t"),
      //         cs.write("Name:" + arr[i].Client_Name + "\t\t"),
      //         cs.write("Mobile:" + arr[i].Mobile_No + "\t"),
      //         cs.write("PlanId:" + arr[i].Plan_ID + "\n")
      //     a++;
      // }
      // await cs.end();
      // return {
      //     success: true,
      //     message: "Null_data Uploaded in txt_file successfully",
      //     data: s,
      //     err: a
      // }
    }

    let makeData = await this.getMakes(payload.Vehicle_Brand);
    // console.log("mkId", this.makeId);
    let master = await this.getMaster(this.makeId, payload.Vehicle_Model[0]);
    // console.log("master", this.masterId);
    let pay = await this.getAmounts(payload.Plan_Id);
    // console.log("plan amount", this.amount);
    // let cxData = await this.getCx(payload.Customer_MobileNo)
    let cx = await this.createCustomer(payload.Customer_Name[0], payload.Customer_MobileNo[0], clientIds, payload.Vehicle_Register_No[0]);
    console.log("Cx id", this.customerId);
    let regVehicle = await this.getRegVehicleId(this.customerId, this.masterId, clientIds, payload.Vehicle_Register_No[0]);
    await this.createSubscription(
      this.amount,
      this.masterId,
      this.customerId,
      clientIds,
      payload.Plan_Id[0],
      payload.lat[0],
      payload.lng[0],
      payload.Plan_Purchased_Date[0],
      this.registerVehicleId,
      payload.Seller_Id[0],
      payload.Vehicle_Register_No[0],
      payload.Customer_Name[0]
    );

    await this.batchService.update({
      id: batch.id, data: {
        Client_Id: clientIds,
        totalCount: payload.Customer_Name.length,
        successCount: sc,
        failedCount: fc.length,
        purpose: purpose
      }
    });


    return {
      success: true,
      message: "success",
      data: sc,
      err: fc.length
    }
  }

  async create(payload: any) {
    if (payload.length > 0) {
      // Create batch
      const batch: any = await this.batchService.create({
        successCount: payload.length,
        totalCount: payload.length
      });
      const clientIds = [];
      for (const p of payload) {
        p.batch = batch.id;
        clientIds.push(p.Client_Id);
        await this.batchService.update({ id: batch.id, data: { Client_Id: clientIds } });
        const createdData = await this.succcessRepo.create(p);
        const saveData: any = await this.succcessRepo.save(createdData);
      }
      return {
        success: true, message: 'Created successfully',
        data: {}
      }
    } else {
      return {
        success: false, message: '',
        data: {}
      }
    }
  }

  async readsheet(): Promise<any> {
    const a = await this.succcessRepo.query("SELECT *  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'success_record';")
    const ff = [];
    // a[i].COLUMN_NAME == 'Client_Id' ||
    for (let i = 0; i < a.length; i++) {
      if (a[i].COLUMN_NAME == 'id' || a[i].COLUMN_NAME == 'Client_Id' || a[i].COLUMN_NAME == 'createdAt' ||
        a[i].COLUMN_NAME == 'updateAt' || a[i].COLUMN_NAME == 'batchId' || a[i].COLUMN_NAME == 'status') { }
      else {
        ff.push(a[i].COLUMN_NAME);
      }
    }
    return {
      success: true,
      message: 'Profile Fetched Successfully!',
      data: ff,
      err: null,
    };

  }

  async countRow() {
    const c = await this.succcessRepo.count();
    return {
      success: true,
      message: 'File-count Fetched Successfully!',
      data: c,
    };
  }

  async getRecords() {
    const r = await this.succcessRepo.find(
      { relations: ['batch'] }
    );
    return {
      success: true,
      message: 'Success-Records Fetched Successfully!',
      data: r,
    };
  }

  async getMakes(payload: any): Promise<any> {
    let vehicleData: any = [];
    let hello: any;

    for (let i = 0; i < payload.length; i++) {
      hello = await this.api.getMakes(payload[i])
      vehicleData.push(hello[0]);

    }
    this.makeId = vehicleData[0].id;
    return {
      success: true,
      message: "Makes Id fetched",
      data: vehicleData.id,
    }

  }

  async getMaster(makeid, payload: any): Promise<any> {
    let masterdata: any = [];
    // console.log(makeid, payload);
    // for(let i = 0; i< payload.length; i++){
    //   masterdata.push(await this.api.getMasterId(makeid, payload[i]));
    // }  
    masterdata = await this.api.getMasterId(makeid, payload);
    this.masterId = masterdata;
  }

  async getAmounts(payload: any): Promise<any> {
    let amountData: any = [];
    // console.log(payload[0]);
    // for(let i = 0; i< payload.length; i++){
    //   masterdata.push(await this.api.getMasterId(payload[i]));
    // }  
    amountData = await this.api.getAmount(payload[0]);
    this.amount = amountData.sellingPrice;
  }

  async createCustomer(Customer_Name, Customer_MobileNo, clientIds, Vehicle_Register_No): Promise<any> {
    const body = {
      "name": Customer_Name,
      "mobileNo": Customer_MobileNo,
      "clientIds": [
        clientIds
      ]
    }
    const vehiclebody = {
      clientId: clientIds,
      customerId: this.customerId,
      regNo: Vehicle_Register_No,
      vehicleMasterId: this.masterId,
    }
    let customer: any;
    let create: any = [];
    let createRegVehicle: any = [];


    customer = await this.api.getCxId(Customer_MobileNo);
    if (customer.length === 0) {
      console.log('not Avail');
      create = await this.api.createCx(body); //creating Customer
      customer = await this.api.getCxId(Customer_MobileNo);
      this.customerId = customer[0].id;
      createRegVehicle = await this.api.createCxVehicle(vehiclebody); //creating Registered Vehicle
      console.log(createRegVehicle);
      this.registerVehicleId = createRegVehicle.id;
      console.log(this.registerVehicleId);
    }
    const newCustomer = await this.api.getCxId(Customer_MobileNo);  // getting customer Id
    this.customerId = newCustomer[0].id;

  }

  async getRegVehicleId(customerId, masterId, clientIds, Vehicle_Register_No): Promise<any> {
    let createRegVehicle: any = [];
    const vehiclebody = {
      clientId: clientIds,
      customerId: this.customerId,
      regNo: Vehicle_Register_No,
      vehicleMasterId: this.masterId,
    }
    let id = await this.api.getRegVehicles(customerId);
    console.log('regVehicles', id);
    if (id) { //(id===0)
      createRegVehicle = await this.api.createCxVehicle(vehiclebody); //creating Registered Vehicle for existing Cx
      console.log('creating for excistCx', createRegVehicle);
      this.registerVehicleId = createRegVehicle.id;
      console.log(this.registerVehicleId);

    } else {
      console.log('else part');
      const data = await this.api.getRegVehicleId(this.masterId, this.registerVehicleId);
      if (data.length === 1) {
        console.log('only one vehicle avail');
        return this.registerVehicleId;
      } else {
        console.log('else');
        for (let i = 0; i < data.length; i++) { }
      }
    }
  }

  async createSubscription(amount, masterId, customerId, clientIds, Plan_Id,
    lat, lng, Plan_Purchased_Date, registerVehicleId, Seller_Id, Vehicle_Register_No, Customer_Name): Promise<any> {
    const body = {
      // amount: amount,
      // vehicleId: masterId,
      // customerId: customerId,
      // paymentVendor: "RAZORPAY",
      // clientId: clientIds,
      // subscriptionPlanId: Plan_Id,
      // lat: lat,
      // lng: lng,
      // paymentDate: Plan_Purchased_Date,
      // source: "Customer",
      // registeredVehicle: registerVehicleId,
      // sellerId: Seller_Id
      purchaseType: '1',
      targetUserType: '1',
      amount: amount,
      vehicleId: masterId,
      customerId: customerId,
      clientId: clientIds,
      sellerId: Seller_Id,
      subscriptionPlanId: Plan_Id,
      lat: lat,
      lng: lng,
      paymentDate: Plan_Purchased_Date,
      source: 'Client',
      registeredVehicle: registerVehicleId,
      note: 'subscription is created',
      registrationNumber: Vehicle_Register_No,
      description: 'subscription is created',
      customerEmail: null,
      customerName: Customer_Name,
      paymentStatus: "paid",
      paymentOrderId: "client_entry",
      paymentRefNo: "client_entry",
      paymentVendor: "SELF"
    }
    console.log(body);
    const createsb = await this.api.createSubscrip(body);
    console.log(createsb.id);
    this.subCreatedId = createsb.id;
  }

  async createPurchase(payload: any): Promise<any> {
    const res = await this.api.createCustomerPurchase(this.subCreatedId);
    console.log(res);
  }

}

