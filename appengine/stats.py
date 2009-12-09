import datetime
import logging
import os

from django.utils import simplejson
from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app


class SiteTime(db.Model):
  user = db.UserProperty(required=True)
  site = db.StringProperty(required=True)
  seconds = db.FloatProperty(required=True)
  day = db.DateProperty(required=True)


class UserInfo(db.Model):
  user = db.UserProperty(required=True)
  last_update = db.DateTimeProperty()


class View(webapp.RequestHandler):

  def get(self):
    site_times = SiteTime.gql('WHERE user = :1 AND day = :2 ORDER BY seconds',
                              users.get_current_user(),
                              datetime.datetime.now().date())

    user_info = UserInfo.gql('WHERE user = :1',
                             users.get_current_user()).get()
    if user_info:
      last_update = user_info.last_update
    else:
      last_update = None

    template_values = {
        'user': users.get_current_user(),
        'last_update': last_update,
        'site_times': [{'site': x.site,
                        'minutes': x.seconds/float(60)} for x in site_times]
      }

    path = os.path.join(os.path.dirname(__file__), 'templates/stats.html')
    self.response.out.write(template.render(path, template_values))


class Update(webapp.RequestHandler):

  def get(self):
    self.error(501)  # Not implemented.

  def post(self):
    if not self.request.get('sites'):
      self.error(400)  # Bad request.
    sites = simplejson.loads(self.request.get('sites'))

    updates = []
    day = datetime.datetime.now().date()
    for (site, seconds) in sites.iteritems():
      site_time = SiteTime.gql('WHERE user = :1 AND site = :2 AND day = :3',
                               users.get_current_user(), site, day).get()
      if not site_time:
        site_time = SiteTime(user=users.get_current_user(),
                             seconds=0.0,
                             site=site,
                             day=day)
      site_time.seconds += seconds
      updates.append(site_time)
    try:
      db.put(updates)
    except db.TransactionFailedError:
      self.error(500)  # Internal server error.

    user_info = UserInfo.gql('WHERE user = :1', users.get_current_user()).get()
    if not user_info:
      user_info = UserInfo(user=users.get_current_user())
    user_info.last_update=datetime.datetime.now()
    user_info.put()
    self.response.set_status(200)


class Clear(webapp.RequestHandler):

  def get(self):
    data = SiteTime.gql('WHERE user = :1', users.get_current_user())
    db.delete(data)


application = webapp.WSGIApplication(
    [('/stats/update', Update),
     ('/stats/view', View),
     ('/stats/clear', Clear)], debug=True)


def main():
  run_wsgi_app(application)


if __name__ == '__main__':
  main()
