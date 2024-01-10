/**
 * LearningcalendarController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  async getLearningcalendarById(req, res) {
    try {
      const learningcalendarId = req.params.id;
      const learningcalendarData = await Learningcalendar.findOne({ id: learningcalendarId });

      if (!learningcalendarData) {
        return res.notFound('Learningcalendar not found');
      }

      return res.json(learningcalendarData);
    } catch (err) {
      return res.serverError(err);
    }
  },
};

