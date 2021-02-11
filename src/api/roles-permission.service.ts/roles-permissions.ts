// import { UniversalsService } from '../../@core/common/universals.service';


// export class RolesPermissionsService extends UniversalsService {
//   public processCreateRole = async (req) => {
//     try {
//       let obj = req.body;
//       const { name, scheme } = req.body
//       app.locals.db.collection('roles').findOne({ name, scheme }, function (error, result) {
//         if (result && result._id) {
//           res.status(200).json({ status: "Failed", message: "Role name already exists" })
//         } else {
//           app.locals.db.collection('roles').insertOne(obj, function (error, result) {
//             if (error) {
//               res.status(500).json({ status: "Failed", message: "Server Error" })
//             } else {
//               res.status(200).json({ status: "Success", message: "Role was created successfully" })
//             }
//           });
//         }
//       } catch (error) {
//         return this.serviceErrorHandler(req, error)
//       }
//     }
//     }






//   app.route('/roles/create-role').post(
//         function(req, res) {
//     let obj = req.body;
//     const { name, scheme } = req.body
//     app.locals.db.collection('roles').findOne({ name, scheme }, function (error, result) {
//       if (result && result._id) {
//         res.status(200).json({ status: "Failed", message: "Role name already exists" })
//       } else {
//         app.locals.db.collection('roles').insertOne(obj, function (error, result) {
//           if (error) {
//             res.status(500).json({ status: "Failed", message: "Server Error" })
//           } else {
//             res.status(200).json({ status: "Success", message: "Role was created successfully" })
//           }
//         });
//       }

//     })

//   });

//   app.route('/roles/create-permission').post(
//         function(req, res) {
//     let obj = req.body;
//     app.locals.db.collection('permissions').insertOne(obj, function (error, result) {
//       if (error) {
//         error.errmsg.includes("E11000 duplicate key error collection") ? res.status(200).json({ status: "Failed", message: "Role name already exists" }) : res.status(500).json({ status: "Failed", message: "Server Error" })
//       } else {
//         res.status(200).json({ status: "Success", message: "Role was created successfully" })
//       }
//     });
//   });

//   app.route('/roles/get-permission').post(
//         function(req, res) {
//     const query = { scheme: req.body.scheme }
//     app.locals.db.collection('permissions').findOne(query, function (error, result) {
//       if (error) {
//         res.status(500).json({ status: "Failed", message: "Server Error" })
//       } else {
//         res.status(200).json({ status: 'Success', data: result })
//       }
//     });
//   });

//   app.route('/roles/get-roles').post(
//         function(req, res) {
//     const query = { scheme: req.body.scheme }
//     app.locals.db.collection('roles').find(query).toArray(function (error, result) {
//       if (error) {
//         res.status(500).json({ status: "Failed", message: "Server Error" })
//       } else {
//         res.status(200).json({ status: 'Success', data: result })
//       }
//     });
//   });

//   app.route('/roles/update-roles').post(
//         function(req, res) {
//     const { name, permissions, _id, scheme } = req.body
//     const query = { _id: new mongo.ObjectID(_id), scheme };
//     app.locals.db.collection("roles").updateOne(query, { $set: { permissions, name } }, (error, result) => {
//       if (error) {
//         res.status(500).json({ status: "Failed", message: "Server Error" })
//       } else {
//         res.status(200).json({ status: 'Success', message: "Role updated successfully" })
//       }
//     });
//   });

//   app.route('/roles/delete-roles').post(
//         function(req, res) {
//     const { _id, scheme } = req.body
//     const query = { _id: new mongo.ObjectID(_id), scheme };
//     app.locals.db.collection("roles").deleteOne(query, (error, result) => {
//       if (error) {
//         res.status(500).json({ status: "Failed", message: "Server Error" })
//       } else {
//         res.status(200).json({ status: 'Success', message: "Role deleted successfully" })
//       }
//     });
//   });
