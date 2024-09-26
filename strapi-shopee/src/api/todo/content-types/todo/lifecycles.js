// module.exports = {
//   async afterCreate(event) {
//     console.log('Lifecycle afterCreate hook triggered');
//     const { result } = event;
//     console.log('After create hook triggered with event:', result); // Kiểm tra toàn bộ dữ liệu của result
//     try {
//       await strapi.plugin('email').services.email.send({
//         to: 'thanhdong1311@gmail.com',
//         from: 'thanhdong1311ma@gmail.com',
//         subject: 'You have a new todo',
//         text: `Your todo is: ${result.Name}`, // Kiểm tra nếu result có thuộc tính name
//       });
//       console.log('Email sent successfully');
//     } catch (err) {
//       console.log('Error sending email:', err);
//     }
//   },
// };
