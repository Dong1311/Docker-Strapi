'use strict';

/**
 * revenue controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::revenue.revenue');

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::revenue.revenue', ({ strapi }) => ({
//   // Custom logic to update the revenue
//   async updateRevenue(ctx) {
//     const { totalAmount } = ctx.request.body;
//     console.log(totalAmount);
//     // Tìm record đầu tiên trong bảng Revenue
//     const revenueEntry = await strapi.entityService.findMany('api::revenue.revenue', {});

//     if (revenueEntry && revenueEntry.length > 0) {
//       const currentRevenue = revenueEntry[0]; // Giả sử chỉ có 1 record doanh thu

//       // Cộng thêm số tiền vào doanh thu hiện tại
//       const updatedRevenue = await strapi.entityService.update('api::revenue.revenue', currentRevenue.id, {
//         data: {
//           revenue: currentRevenue.revenue + totalAmount,
//         },
//       });

//       // Trả về kết quả
//       return ctx.send({ updatedRevenue });
//     } else {
//       // Nếu chưa có doanh thu nào, tạo một record mới
//       const newRevenue = await strapi.entityService.create('api::revenue.revenue', {
//         data: {
//           revenue: totalAmount,
//         },
//       });

//       // Trả về kết quả
//       return ctx.send({ newRevenue });
//     }
//   },
// }));
