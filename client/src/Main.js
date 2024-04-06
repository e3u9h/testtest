import {useState, useRef, useEffect} from 'react'


function NewPost() {
  const[availableTags, setAvailableTags] = useState([]);
  const[tags, setTags] = useState([]);
  const [privacy, setPrivacy] = useState('false');
  const [fileList, setFileList] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const fetchAvaliableTags = () => {
    fetch('http://localhost:8000tags',{
      mothod: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      const fetchedTags = data.map((item) => item['tag']);
      setAvailableTags(fetchedTags);
    }).catch(err => {
      console.log(err);
    });
  }

  



  








 

  return (
    <div className='container-fluid'>
    </div>
  );
}



function Main() {
  const fetchFollowingsTweet = () => {
  }

  return (<div>
  </div >)
}

export default Main;