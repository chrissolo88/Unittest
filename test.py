from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def setUp(self):
        """Stuff to do before every test."""
        app.config['TESTING'] = True
        
        
    def test_new_session(self):
        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)
            
            self.assertIn('board', session)
            self.assertIsNone(session.get('high_score'))
            self.assertIsNone(session.get('num_plays'))
            self.assertIn('SCORE:', html)
            self.assertIn('TIMER:', html)
            self.assertIn('<h2>WORD LIST</h2>', html)
            
    def test_valid_word(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session['board'] = [["G", "Y", "H", "G", "A"], 
                                 ["C", "A", "T", "R", "T"], 
                                 ["K", "S", "O", "V", "E"], 
                                 ["I", "A", "W", "D", "G"], 
                                 ["I", "P", "H", "T", "J"]]
        res = client.get('/submit-word?word=rated')
        self.assertEqual(res.json['result'], 'ok')
            
    def test_invalid_word(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session['board'] = [["G", "Y", "H", "G", "A"], 
                                 ["C", "A", "T", "R", "T"], 
                                 ["K", "S", "O", "V", "E"], 
                                 ["I", "A", "W", "D", "G"], 
                                 ["I", "P", "H", "T", "J"]]
        res = client.get('/submit-word?word=impossible')

        self.assertEqual(res.json['result'], 'not-on-board')
    