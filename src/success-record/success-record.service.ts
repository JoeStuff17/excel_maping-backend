import { FileService } from './../file/file.service';
import { ApiService } from './../api/api.service';
import { FailedRecordService } from './../failed-record/failed-record.service';
import { STATUS, SuccessRecordEntity } from './entity/success-record.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordBatchService } from 'src/record-batch/record-batch.service';
import { DateTime } from "luxon";

var xml = require('fs');

@Injectable()
export class SuccessRecordService {
  constructor(
    @InjectRepository(SuccessRecordEntity) private readonly succcessRepo: Repository<SuccessRecordEntity>,
    private readonly failedRecordService: FailedRecordService,
    private readonly batchService: RecordBatchService,
    private readonly api: ApiService,
    private readonly fileService: FileService
  ) { }
  makeId: number;
  batch: any;
  masterId: number;
  amount: number;
  customerId: number;
  purchaseDate: any;
  createdRes: [];
  registerVehicleId: number;
  subCreatedId: any;
  position: any = [];
  spc = 0;
  fpc = 0;

  excelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
  }

  //File upload
  async fileUpload(file) {
    await this.fileService.upload(file, 'subscription', process.env.BUCKET_NAME);
    return ({
      bucketName: process.env.BUCKET_NAME,
      path: 'subscription',
      displayName: file.filename,
      extension: file.filename.split('.').pop(),
      mimeType: file.mimetype,
      fileType: file.mimetype
    });
  }

  async creates(payload) {
    // let s = 0;
    let sd: any = [];
    const fc = [];
    let sc = 0;
    let clientIds: any;
    const purpose = 'subscription';
    this.batch = await this.batchService.create({
      totalCount: payload.length,
    });

    // clientIds = payload.Client_Id[0];
    clientIds = 1;

    for (let i = 0; i < payload.length; i++) {
      this.purchaseDate = this.excelDateToJSDate(payload[i].Plan_Purchased_Date);
      if (payload[i].Customer_Name == null ||
        payload[i].Customer_MobileNo == null || payload[i].Vehicle_Brand == null ||
        payload[i].Vehicle_Model == null || payload[i].Seller_Id == null || payload[i].lat == null
        || payload[i].lng == null || payload[i].Plan_Purchased_Date == null || payload[i].Plan_Id == null) {

        fc.push({
          Client_Id: clientIds,
          Customer_Name: payload[i].Customer_Name,
          Customer_MobileNo: payload[i].Customer_MobileNo,
          Vehicle_Brand: payload[i].Vehicle_Brand,
          Vehicle_Model: payload[i].Vehicle_Model,
          Vehicle_Register_No: payload[i].Vehicle_Register_No,
          Seller_Id: payload[i].Seller_Id,
          lat: payload[i].lat,
          lng: payload[i].lng,
          Plan_Purchased_Date: this.purchaseDate,
          Plan_Id: payload[i].Plan_Id,
          processed: false,
          status: STATUS.EMPTY,
          batch: this.batch.id
        });
        await this.failedRecordService.createFailRec(fc);


      } else {
        // payload.batch = Array(payload.Client_Id.length).fill(batch.id);
        const successdata = this.succcessRepo.create({
          Client_Id: clientIds,
          Customer_Name: payload[i].Customer_Name,
          Customer_MobileNo: payload[i].Customer_MobileNo,
          Vehicle_Brand: payload[i].Vehicle_Brand,
          Vehicle_Model: payload[i].Vehicle_Model,
          Vehicle_Register_No: payload[i].Vehicle_Register_No,
          Seller_Id: payload[i].Seller_Id,
          lat: payload[i].lat,
          lng: payload[i].lng,
          Plan_Purchased_Date: this.purchaseDate,
          Plan_Id: payload[i].Plan_Id,
          batch: this.batch.id,
        });
        sd = await this.succcessRepo.save(successdata);
        sc += 1;
      }
      await this.batchService.update({
        id: this.batch.id, data: {
          Client_Id: clientIds,
          totalCount: payload.length,
          successCount: sc,
          failedCount: fc.length,
          success_ProcessedCount: this.spc,
          failed_ProcessedCount: this.fpc,
          purpose: purpose
        }
      });
      //Splicing
      let makeData = await this.getMakes(payload[i].Vehicle_Brand, sd);
      if (makeData.data == 0) {
        payload[i].Vehicle_Model = null;
        payload[i].Plan_Id = 0;
        payload[i].Customer_Name = null;
        payload[i].Customer_MobileNo = 0;
        payload[i].Vehicle_Register_No = null;
        payload[i].Seller_Id = 0;
        payload[i].lat = 0.0;
        payload[i].lng = 0.0;
        payload[i].Plan_Purchased_Date = 0;
      }

      let master = await this.getMaster(this.makeId, payload[i].Vehicle_Model, sd);
      if (master.data == 0) {
        payload[i].Vehicle_Model = null;
        payload[i].Plan_Id = 0;
        payload[i].Customer_Name = null;
        payload[i].Customer_MobileNo = 0;
        payload[i].Vehicle_Register_No = null;
        payload[i].Seller_Id = 0;
        payload[i].lat = 0.0;
        payload[i].lng = 0.0;
        payload[i].Plan_Purchased_Date = 0;
      }

      let amt = await this.getAmounts(payload[i].Plan_Id, sd);
      if (amt.data == 0) {
        payload[i].Vehicle_Model = null;
        payload[i].Plan_Id = 0;
        payload[i].Customer_Name = null;
        payload[i].Customer_MobileNo = 0;
        payload[i].Vehicle_Register_No = null;
        payload[i].Seller_Id = 0;
        payload[i].lat = 0.0;
        payload[i].lng = 0.0;
        payload[i].Plan_Purchased_Date = 0;
      }

      let cx = await this.createCxId(payload[i].Customer_Name, payload[i].Customer_MobileNo, clientIds, sd);
      if (cx.data == undefined) {
        payload[i].Vehicle_Model = null;
        payload[i].Plan_Id = 0;
        payload[i].Customer_Name = null;
        payload[i].Customer_MobileNo = 0;
        payload[i].Vehicle_Register_No = null;
        payload[i].Seller_Id = 0;
        payload[i].lat = 0.0;
        payload[i].lng = 0.0;
        payload[i].Plan_Purchased_Date = 0;
      }

      let regVehicle = await this.getRegVehicleId(this.customerId, clientIds, payload[i].Vehicle_Register_No, this.masterId, sd);
      if (regVehicle.data == undefined) {
        payload[i].Vehicle_Model = null;
        payload[i].Plan_Id = 0;
        payload[i].Customer_Name = null;
        payload[i].Customer_MobileNo = 0;
        payload[i].Vehicle_Register_No = null;
        payload[i].Seller_Id = 0;
        payload[i].lat = 0.0;
        payload[i].lng = 0.0;
        payload[i].Plan_Purchased_Date = 0;
      }

      let createSub = await this.createSubscription(
        this.amount,
        this.masterId,
        this.customerId,
        clientIds,
        payload[i].Plan_Id,
        payload[i].lat,
        payload[i].lng,
        this.excelDateToJSDate(payload[i].Plan_Purchased_Date),
        this.registerVehicleId,
        payload[i].Seller_Id,
        payload[i].Vehicle_Register_No,
        payload[i].Customer_Name,
        sd
      );
    }


    return {
      success: true,
      message: 'success',
      data: sc,
      err: fc.length
    }
  }

  //Rough work
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

  //sending SQL Headers to front-End
  async readsheet(): Promise<any> {
    const a = await this.succcessRepo.query("SELECT *  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'success_record';")
    const ff = [];
    // a[i].COLUMN_NAME == 'Client_Id' ||
    for (let i = 0; i < a.length; i++) {
      if (a[i].COLUMN_NAME == 'id' || a[i].COLUMN_NAME == 'Client_Id' || a[i].COLUMN_NAME == 'createdAt' ||
        a[i].COLUMN_NAME == 'updateAt' || a[i].COLUMN_NAME == 'batchId' || a[i].COLUMN_NAME == 'status' ||
        a[i].COLUMN_NAME == 'Subscription_Id' || a[i].COLUMN_NAME == 'processed') { }
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

  //Calling vehicle Make api
  async getMakes(payload: any, sd): Promise<any> {
    let vehicleData: any = [];
    let data: any;
    data = await this.api.getMake(payload)
    if (data !== undefined) {
      vehicleData = data.id;
    } else {
      console.log('Vehicle brand Error'); //Send
      this.fpc += 1;
      await this.succcessRepo.update(
        { id: sd.id }, { status: 'Vehicle brand Error' , processed: false}
      );
    }
    this.makeId = vehicleData;
    return {
      success: true,
      message: 'Makes Id fetched',
      data: this.makeId,
    }

  }

  //Calling masterId api
  async getMaster(makeid, payload: any, sd): Promise<any> {
    let masterdata: any = [];
    if (payload !== null) {
      const data = await this.api.getMasterId(makeid, payload);
      if (data !== undefined) {
        masterdata = data[0].id;
      } else {
        console.log('Vehicle model Error'); //Send to frontEnd
        this.fpc += 1;
        await this.succcessRepo.update(
          {id: sd.id }, { status: 'Vehicle model Error' , processed: false}
        );
      }
    }
    this.masterId = masterdata
    return {
      success: true,
      message: 'Master Id fetched',
      data: this.masterId,
    }
  }

  //Calling planId api for amount
  async getAmounts(payload: any, sd): Promise<any> {
    let amountData: any = [];
    if (payload !== 0) {
      const data = await this.api.getAmount(payload);
      if (data !== undefined) {
        amountData = data['sellingPrice'];
      } else {
        console.log('PlanId Error'); //send
        this.fpc += 1;
        await this.succcessRepo.update(
          { id: sd.id }, { status: 'planId Error' , processed: false}
        );
      }
    }
    this.amount = amountData;
    // console.log('Amount', this.amount);
    return {
      success: true,
      message: 'Plan amount fetched',
      data: this.amount,
    }
  }

  //Calling customer id
  async createCxId(Customer_Name, Customer_MobileNo, clientIds, sd): Promise<any> {
    let customer: any = [];
    let createNew: any = [];
    this.customerId = null;
    if (Customer_MobileNo !== 0 && Customer_Name !== null) {
      if (Customer_MobileNo.toString().length == 10) {
        customer = await this.api.getCxId(Customer_MobileNo); //fetching Cx Id
        if (customer !== undefined) {
          this.customerId = customer.id;
        } else {
          console.log('Not existing Cx');
          createNew = await this.createCx(Customer_Name, Customer_MobileNo, clientIds, sd); //creating Customer
          this.customerId = createNew.data.id;
        }
      } else {
        console.log('Not a valid mobileNo');//send to frontEnd
        this.fpc += 1;
        await this.succcessRepo.update(
          { id: sd.id }, { status: 'Mobile no Error', processed: false}
        );
      }
    }
    return {
      success: true,
      message: 'Cx id fetched',
      data: this.customerId,
    }
  }

  //create new Cx
  async createCx(Customer_Name, Customer_MobileNo, clientIds, sd) {
    let createNew: any = [];
    if (Customer_Name !== null) {
      createNew = await this.api.createCx(Customer_Name, Customer_MobileNo, clientIds); //creating Customer
      this.createdRes = createNew;
    }
    return {
      success: true,
      message: 'Cx created successfully',
      data: createNew.data,
    }
  }

  //get Register VehicleId - if not create vehicle 
  async getRegVehicleId(customerId, clientIds, Vehicle_Register_No, masterId, sd): Promise<any> {
    let createRegVehicle: any = [];
    if (customerId !== 0 && Vehicle_Register_No !== null) {
      const id = await this.api.getRegVehicles(Vehicle_Register_No, masterId);
      if (!id['data']) {
        //create vehicle
        createRegVehicle = await this.createVehicle(customerId, clientIds, Vehicle_Register_No, masterId, sd);
        this.registerVehicleId = createRegVehicle.data;
      } else {
        this.registerVehicleId = id['data'][0].id;
      }
    }
    return {
      success: true,
      message: 'Cx created successfully',
      data: this.registerVehicleId,
    }
  }

  //Creating vehicle for new Cx
  async createVehicle(customerId, clientIds, Vehicle_Register_No, masterId, sd): Promise<any> {
    let createRegVehicle: any = [];
    if (customerId !== 0 && Vehicle_Register_No !== null) {
      const chk = await this.api.getRegVehicleCheck(Vehicle_Register_No); //case 1
      if (chk == false) {
        console.log('Vehicle RegNo already exist', chk); // Send to frontEnd
        this.fpc += 1;
        await this.succcessRepo.update(
          { id: sd.id }, { status: 'Vehicle RegisterNo already exist' , processed: false}
        );
      } else {
        createRegVehicle = await this.api.createCxVehicle(customerId, clientIds, Vehicle_Register_No, masterId); //creating Registered Vehicle for new Cx
      }
    }
    return {
      success: true,
      message: 'Registered vehicleId fetched',
      data: createRegVehicle.id,
    }
  }

  async createSubscription(amount, masterId, customerId, clientIds, Plan_Id,
    lat, lng, Plan_Purchased_Date, registerVehicleId, Seller_Id, Vehicle_Register_No, Customer_Name, sd): Promise<any> {

    const converterd = DateTime.fromISO(Plan_Purchased_Date.toISOString()).toJSDate();

    const body = {
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
      paymentDate: converterd,
      registeredVehicle: registerVehicleId,
      registrationNumber: Vehicle_Register_No,
      customerEmail: null,
      customerName: Customer_Name,
      source: 'Client',
      note: 'Client side subscription is creating',
      description: 'Client side subscription is creating',
      paymentStatus: 'paid',
      paymentOrderId: 'client_entry',
      paymentRefNo: 'client_entry',
      paymentVendor: 'SELF'
    }
    if (amount > 0 && masterId > 0 && customerId > 0 && Seller_Id > 0 &&
      Plan_Id > 0 && lat > 0.0 && lng > 0.0 && Plan_Purchased_Date > 0 && registerVehicleId > 0 && Vehicle_Register_No !== null) {
      this.subCreatedId = await this.api.createSubscrip(body);
      console.log(this.subCreatedId.data);
      
      if (this.subCreatedId.data) {
        this.spc += 1;
        await this.succcessRepo.update(
          { id: sd.id }, { status: STATUS.CREATED, Subscription_Id: this.subCreatedId.data.subscriptionId, processed: true } //success
        );
        await this.batchService.update({
          id: this.batch.id, data: {
            success_ProcessedCount: this.spc
          }
        });

      } else {
        this.fpc += 1;
        await this.succcessRepo.update(
          { id: sd.id }, { status: this.subCreatedId.message, Subscription_Id: null, processed: false } //failed
        );
        await this.batchService.update({
          id: this.batch.id, data: {
            failed_ProcessedCount: this.fpc
          }
        });
      }
    }
    return {
      success: true,
      message: 'Subscription created successfully',
      // data: this.subCreatedId !== null ? this.subCreatedId.subscriptionId : this.subCreatedId.message
    }
  }

}

